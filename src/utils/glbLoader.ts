import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export interface GLBResult {
  vertices: Float32Array;
  vertexCount: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  originalVertexCount: number;
}

/**
 * Deduplicate vertices using spatial hashing.
 * Divides space into a grid of cells, keeps one point per cell.
 */
function spatialDeduplicate(
  positions: Float32Array,
  cellSize: number,
): Float32Array {
  const map = new Map<string, number>();
  const result: number[] = [];

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const cx = Math.floor(x / cellSize);
    const cy = Math.floor(y / cellSize);
    const cz = Math.floor(z / cellSize);
    const key = `${cx},${cy},${cz}`;

    if (!map.has(key)) {
      map.set(key, result.length / 3);
      result.push(x, y, z);
    }
  }

  return new Float32Array(result);
}

/**
 * Random sample from a Float32Array to a target count.
 */
function randomSample(vertices: Float32Array, targetCount: number): Float32Array {
  const totalCount = vertices.length / 3;
  if (totalCount <= targetCount) return vertices;

  // Fisher-Yates partial shuffle to select first N
  const indices = new Uint32Array(totalCount);
  for (let i = 0; i < totalCount; i++) indices[i] = i;

  for (let i = 0; i < targetCount; i++) {
    const j = i + Math.floor(Math.random() * (totalCount - i));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }

  const result = new Float32Array(targetCount * 3);
  for (let i = 0; i < targetCount; i++) {
    const idx = indices[i] * 3;
    result[i * 3] = vertices[idx];
    result[i * 3 + 1] = vertices[idx + 1];
    result[i * 3 + 2] = vertices[idx + 2];
  }

  return result;
}

/**
 * Collect all vertex positions from a Group (GLTF scene).
 * Recursively walks through children and collects geometry vertices.
 */
function collectVertices(object: THREE.Object3D): Float32Array {
  const all: number[] = [];

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const geo = child.geometry;
    if (!geo) return;

    let positions: THREE.BufferAttribute | null = null;
    if (geo.attributes.position) {
      positions = geo.attributes.position;
    } else if (geo instanceof THREE.BufferGeometry && geo.index) {
      // De-index
      const posAttr = geo.attributes.position;
      const index = geo.index;
      for (let i = 0; i < index.count; i++) {
        const vi = index.getX(i);
        all.push(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi));
      }
      return;
    }

    if (positions) {
      for (let i = 0; i < positions.count; i++) {
        all.push(positions.getX(i), positions.getY(i), positions.getZ(i));
      }
    }
  });

  return new Float32Array(all);
}

/**
 * Compute bounding box of vertex array.
 */
function computeBounds(vertices: Float32Array): GLBResult['bounds'] {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  return { minX, maxX, minY, maxY, minZ, maxZ };
}

const TARGET_POINTS = 45_000;
const MAX_DEDUP_POINTS = 80_000;

/**
 * Load a GLB file and extract normalized vertex positions for point cloud rendering.
 *
 * Pipeline:
 * 1. GLTFLoader.load → scene
 * 2. Collect all mesh vertices → raw Float32Array
 * 3. Spatial deduplication (coarse grid) → deduped
 * 4. If still too many, random sample → sampled
 * 5. Compute bounds
 */
export async function loadGLB(url: string): Promise<GLBResult> {
  const loader = new GLTFLoader();

  const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf as { scene: THREE.Group }),
      (progress) => {
        // progress callback — can be used for loading bar
        if (progress.total) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          console.log(`[GLB] Loading: ${pct}%`);
        }
      },
      (err) => reject(err),
    );
  });

  console.log('[GLB] Model loaded, extracting vertices...');

  const rawVertices = collectVertices(gltf.scene);
  const originalCount = rawVertices.length / 3;
  console.log(`[GLB] Raw vertices: ${originalCount.toLocaleString()}`);

  // Step 1: Spatial dedup with coarse grid
  const bounds = computeBounds(rawVertices);
  const maxDim = Math.max(
    bounds.maxX - bounds.minX,
    bounds.maxY - bounds.maxY,
    bounds.maxZ - bounds.maxZ,
  );
  const cellSize = maxDim / 350; // finer grid for better distribution
  const deduped = spatialDeduplicate(rawVertices, cellSize);
  console.log(`[GLB] After dedup: ${(deduped.length / 3).toLocaleString()} vertices`);

  // Step 2: Sample to target
  let final = deduped;
  if (deduped.length / 3 > MAX_DEDUP_POINTS) {
    final = randomSample(deduped, TARGET_POINTS);
    console.log(`[GLB] After sampling: ${(final.length / 3).toLocaleString()} vertices`);
  }

  const finalBounds = computeBounds(final);

  return {
    vertices: final,
    vertexCount: final.length / 3,
    bounds: finalBounds,
    originalVertexCount: originalCount,
  };
}

/**
 * Normalize vertices to [-1, 1] range centered at origin.
 * Same interface as the OBJ pipeline.
 */
export function normalizeGLBVertices(result: GLBResult): Float32Array {
  const { bounds, vertices } = result;
  const cx = (bounds.maxX + bounds.minX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const cz = (bounds.maxZ + bounds.minZ) / 2;
  const range = Math.max(
    bounds.maxX - bounds.minX,
    bounds.maxY - bounds.minY,
    bounds.maxZ - bounds.minZ,
  ) / 2 || 1;

  const out = new Float32Array(vertices.length);
  for (let i = 0; i < result.vertexCount; i++) {
    const idx = i * 3;
    out[idx] = (vertices[idx] - cx) / range;
    out[idx + 1] = (vertices[idx + 1] - cy) / range;
    out[idx + 2] = (vertices[idx + 2] - cz) / range;
  }

  return out;
}
