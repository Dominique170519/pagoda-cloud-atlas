import { useState, useCallback, useRef } from 'react';
import { parseOBJ, normalizeVertices, groupByLayers, type LayerGroup, type ParsedOBJ } from '../utils/objLoader';
import { loadGLB, normalizeGLBVertices, type GLBResult } from '../utils/glbLoader';

export type ViewMode = 'cloud' | 'wireframe' | 'photo';
export type ToolMode = 'rotate' | 'measure' | 'slice' | 'explode' | 'restore';

export interface PointCloudState {
  vertices: Float32Array | null;
  vertexCount: number;
  isExploded: boolean;
  layers: LayerGroup[];
  numLayers: number;
  viewMode: ViewMode;
  activeTool: ToolMode;
  scanActive: boolean;
  wipeActive: boolean;
  wipeProgress: number;
  loading: boolean;
  error: string | null;
}

const initialState: PointCloudState = {
  vertices: null,
  vertexCount: 0,
  isExploded: false,
  layers: [],
  numLayers: 9,
  viewMode: 'cloud',
  activeTool: 'rotate',
  scanActive: false,
  wipeActive: false,
  wipeProgress: 0.5,
  loading: false,
  error: null,
};

export function usePointCloud() {
  const [state, setState] = useState<PointCloudState>(initialState);
  const originalVerticesRef = useRef<Float32Array | null>(null);

  const loadOBJ = useCallback(async (url: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parsed = parseOBJ(text);
      const normalized = normalizeVertices(parsed);
      const layers = groupByLayers(normalized, state.numLayers);

      originalVerticesRef.current = normalized;

      setState((s) => ({
        ...s,
        vertices: normalized,
        vertexCount: parsed.vertexCount,
        layers,
        loading: false,
        isExploded: false,
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: (e as Error).message,
      }));
    }
  }, [state.numLayers]);

  const loadGLBModel = useCallback(async (url: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      console.log('[PointCloud] Loading GLB from:', url);
      const result: GLBResult = await loadGLB(url);
      const normalized = normalizeGLBVertices(result);
      const layers = groupByLayers(normalized, state.numLayers);

      originalVerticesRef.current = normalized;

      setState((s) => ({
        ...s,
        vertices: normalized,
        vertexCount: result.vertexCount,
        layers,
        loading: false,
        isExploded: false,
      }));
      console.log(`[PointCloud] GLB loaded: ${result.vertexCount.toLocaleString()} points (from ${result.originalVertexCount.toLocaleString()} raw)`);
    } catch (e) {
      console.error('[PointCloud] GLB load failed:', e);
      setState((s) => ({
        ...s,
        loading: false,
        error: (e as Error).message,
      }));
    }
  }, [state.numLayers]);

  const loadProcedural = useCallback(() => {
    // Generate procedural pagoda point cloud
    const points: number[] = [];
    const LAYER_COUNT = state.numLayers;
    const RADIUS = 1.0;
    const TOTAL_HEIGHT = 2.5;

    for (let l = 0; l < LAYER_COUNT; l++) {
      const t = l / (LAYER_COUNT - 1);
      const y = -TOTAL_HEIGHT / 2 + t * TOTAL_HEIGHT;
      const baseWidth = RADIUS * (1 - t * 0.65);
      const pointsPerLayer = 400 + Math.floor((1 - t) * 400);
      const eaveWidth = baseWidth * 1.15;

      for (let i = 0; i < pointsPerLayer; i++) {
        const angle = (i / pointsPerLayer) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const isEave = Math.random() < 0.25;
        const w = isEave ? eaveWidth : baseWidth;
        const r = w * Math.sqrt(Math.random()) * (0.7 + Math.random() * 0.3);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const yOff = (Math.random() - 0.5) * 0.04 + (isEave ? 0.02 : -0.02);
        points.push(x, y + yOff, z);
      }

      // Add some interior points for the current layer body
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = baseWidth * 0.3 * Math.sqrt(Math.random());
        points.push(Math.cos(angle) * r, y + (Math.random() - 0.5) * 0.06, Math.sin(angle) * r);
      }
    }

    const vertices = new Float32Array(points);
    const layers = groupByLayers(vertices, state.numLayers);
    originalVerticesRef.current = vertices;

    setState((s) => ({
      ...s,
      vertices,
      vertexCount: points.length / 3,
      layers,
      isExploded: false,
      loading: false,
    }));
  }, [state.numLayers]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((s) => ({ ...s, viewMode: mode }));
  }, []);

  const setActiveTool = useCallback((tool: ToolMode) => {
    setState((s) => ({ ...s, activeTool: tool }));
  }, []);

  const toggleExplode = useCallback(() => {
    setState((s) => ({ ...s, isExploded: !s.isExploded }));
  }, []);

  const toggleScan = useCallback(() => {
    setState((s) => ({ ...s, scanActive: !s.scanActive }));
  }, []);

  const toggleWipe = useCallback(() => {
    setState((s) => ({
      ...s,
      wipeActive: !s.wipeActive,
      activeTool: s.wipeActive ? 'rotate' : 'slice',
    }));
  }, []);

  const setWipeProgress = useCallback((progress: number) => {
    setState((s) => ({ ...s, wipeProgress: Math.max(0, Math.min(1, progress)) }));
  }, []);

  const setNumLayers = useCallback((num: number) => {
    setState((s) => {
      if (originalVerticesRef.current) {
        const layers = groupByLayers(originalVerticesRef.current, num);
        return { ...s, numLayers: num, layers };
      }
      return { ...s, numLayers: num };
    });
  }, []);

  const triggerRestore = useCallback(() => {
    setState((s) => ({ ...s, isExploded: false }));
  }, []);

  return {
    state,
    loadOBJ,
    loadGLB: loadGLBModel,
    loadProcedural,
    setViewMode,
    setActiveTool,
    toggleExplode,
    toggleScan,
    toggleWipe,
    setWipeProgress,
    setNumLayers,
    triggerRestore,
  };
}
