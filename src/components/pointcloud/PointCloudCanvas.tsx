import { useRef, useMemo, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { LayerGroup, ViewMode } from '../../hooks/usePointCloud';

/* ------------------------------------------------------------------ */
/*  Rendered GLTF model layer                                          */
/* ------------------------------------------------------------------ */
function PagodaModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color('#C9A84E'),
      specular: new THREE.Color('#1A1A20'),
      shininess: 15,
      flatShading: true,
      transparent: false,
      side: THREE.FrontSide,
    });
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [material]);

  return <primitive ref={modelRef} object={gltf.scene.clone()} scale={0.9} />;
}

/* ------------------------------------------------------------------ */
/*  Scan-line glow                                                     */
/* ------------------------------------------------------------------ */
function ScanLine({ x, visible }: { x: number; visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.visible = visible;
      meshRef.current.position.x = x;
    }
  });

  return (
    <mesh ref={meshRef} visible={visible}>
      <planeGeometry args={[0.012, 3.5]} />
      <meshBasicMaterial
        color="#00D4FF"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  PointCloud with clipping support                                   */
/* ------------------------------------------------------------------ */
interface PointCloudRendererProps {
  vertices: Float32Array;
  isExploded: boolean;
  layers: LayerGroup[];
  viewMode: ViewMode;
  wipeProgress: number;
  wipeActive: boolean;
  glbUrl: string;
  onWipeChange: (progress: number) => void;
}

function PointCloudRenderer({
  vertices,
  isExploded,
  layers,
  viewMode,
  wipeProgress: wipeProgressProp,
  wipeActive,
  glbUrl,
  onWipeChange,
}: PointCloudRendererProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const targetExplosion = useRef(0);
  const clipPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0));
  const { gl } = useThree();

  // Enable local clipping
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // Create merged geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, [vertices]);

  // Map each vertex to its layer color
  const colors = useMemo(() => {
    const arr = new Float32Array(vertices.length);
    const vertexCount = vertices.length / 3;
    const layerMap = new Map<number, number>();

    for (const layer of layers) {
      for (const idx of layer.vertexIndices) {
        layerMap.set(idx, layer.layerIndex);
      }
    }

    for (let i = 0; i < vertexCount; i++) {
      const l = layerMap.get(i) ?? 0;
      const color = layers[l]?.color ?? [0, 0.83, 1.0];
      arr[i * 3] = color[0];
      arr[i * 3 + 1] = color[1];
      arr[i * 3 + 2] = color[2];
    }

    return arr;
  }, [vertices, layers]);

  const colorAttr = useMemo(() => {
    return new THREE.BufferAttribute(colors, 3);
  }, [colors]);

  // Update point material clipping plane based on wipeProgress
  useEffect(() => {
    const mat = pointsRef.current?.material;
    if (!(mat instanceof THREE.PointsMaterial)) return;

    if (wipeActive) {
      // wipeProgress: 0 = all point cloud, 1 = all model
      // Clipping plane clips points where they are on the "wrong" side
      // Plane at x position mapped from wipeProgress: [-2, 2]
      const clipX = (wipeProgressProp - 0.5) * 4; // maps 0→-2, 0.5→0, 1→2
      clipPlaneRef.current.set(new THREE.Vector3(-1, 0, 0), clipX);
      mat.clippingPlanes = [clipPlaneRef.current];
      mat.clipShadows = true;
      mat.needsUpdate = true;
    } else {
      mat.clippingPlanes = [];
      mat.clipShadows = false;
      mat.needsUpdate = true;
    }
  }, [wipeActive, wipeProgressProp]);

  // Update target explosion smoothly
  useEffect(() => {
    targetExplosion.current = isExploded ? 1 : 0;
  }, [isExploded]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const current = explosionProgress;
    const target = targetExplosion.current;
    const speed = 2.5;
    const next = current + (target - current) * Math.min(speed * delta, 1);
    setExplosionProgress(next);

    // Apply explosion: deform positions
    if (target > 0.01 || next > 0.01) {
      const pos = pointsRef.current.geometry.attributes.position;
      const orig = geometry.attributes.position;
      const count = orig.count;

      for (let i = 0; i < count; i++) {
        const ox = orig.getX(i);
        const oy = orig.getY(i);
        const oz = orig.getZ(i);

        let layerIdx = 0;
        for (const layer of layers) {
          if (layer.vertexIndices.includes(i)) {
            layerIdx = layer.layerIndex;
            break;
          }
        }

        const layerT = layerIdx / (layers.length - 1 || 1);
        const angle = layerT * Math.PI * 3 + i * 0.3;
        const outwardDir = new THREE.Vector3(
          Math.cos(angle) * (1 + layerT * 0.5),
          (layerT - 0.5) * 1.5,
          Math.sin(angle) * (1 + layerT * 0.5),
        ).normalize();

        const distance = (1 + layerT * 2.5) * next;

        pos.setXYZ(
          i,
          ox + outwardDir.x * distance,
          oy + outwardDir.y * distance,
          oz + outwardDir.z * distance,
        );
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    } else if (current > 0 && next <= 0.01) {
      // Snap back: copy original positions exactly
      const pos = pointsRef.current.geometry.attributes.position;
      const orig = geometry.attributes.position;
      for (let i = 0; i < orig.count; i++) {
        pos.setXYZ(i, orig.getX(i), orig.getY(i), orig.getZ(i));
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Point size based on view mode
    if (pointsRef.current && pointsRef.current.material instanceof THREE.PointsMaterial) {
      const mat = pointsRef.current.material;
      const targetSize = viewMode === 'cloud' ? 0.008 : 0.005;
      mat.size += (targetSize - mat.size) * 0.15;
    }
  });

  // Update geometry color on viewMode change
  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('color', colorAttr);
    }
  }, [colorAttr]);

  return (
    <group ref={groupRef}>
      {/* Rendered 3D model (underneath) */}
      {glbUrl && (
        <Suspense fallback={null}>
          <PagodaModel url={glbUrl} />
        </Suspense>
      )}

      {/* Point cloud overlay */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            {...geometry.attributes.position}
          />
          <bufferAttribute
            attach="attributes-color"
            {...colorAttr}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.008}
          vertexColors
          transparent
          opacity={0.7}
          depthWrite
          sizeAttenuation
          clippingPlanes={[]}
        />
      </points>

      {/* Scan line at wipe boundary */}
      <ScanLine
        x={(wipeProgressProp - 0.5) * 4}
        visible={wipeActive}
      />

      {/* Grid helper */}
      <gridHelper
        args={[4, 20, '#1A1A24', '#0D0D14']}
        position={[0, -1.3, 0]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Wipe drag handler                                                  */
/* ------------------------------------------------------------------ */
function WipeHandler({
  active,
  onProgress,
}: {
  active: boolean;
  onProgress: (p: number) => void;
}) {
  const { size } = useThree();
  const dragging = useRef(false);
  const startProgress = useRef(0);
  const startX = useRef(0);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const onDown = (e: MouseEvent) => {
      if (!active) return;
      dragging.current = true;
      startX.current = e.clientX;
      startProgress.current = 0.5; // Will be updated by the parent
      (e.target as HTMLElement).style.cursor = 'ew-resize';
    };

    const onMove = (e: MouseEvent) => {
      if (!active || !dragging.current) return;
      const dx = e.clientX - startX.current;
      const progress = Math.max(0, Math.min(1, startProgress.current + dx / (size.width * 0.6)));
      onProgress(progress);
    };

    const onUp = () => {
      dragging.current = false;
      if (active) {
        (document.querySelector('canvas') as HTMLElement)?.style.setProperty('cursor', 'ew-resize');
      }
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // Set cursor
    if (active) {
      canvas.style.cursor = 'ew-resize';
    } else {
      canvas.style.cursor = '';
    }

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [active, size.width, onProgress]);

  // Keep startProgress in sync
  useEffect(() => {
    startProgress.current = 0.5;
  }, [active]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper                                                     */
/* ------------------------------------------------------------------ */
interface PointCloudCanvasProps extends PointCloudRendererProps {
  onToolSelect?: (tool: string) => void;
}

export default function PointCloudCanvas({
  wipeProgress,
  wipeActive,
  glbUrl,
  onWipeChange,
  ...props
}: PointCloudCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 45, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: '#08080C' }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <directionalLight position={[0, -1, 3]} intensity={0.3} />

      <PointCloudRenderer
        wipeProgress={wipeProgress}
        wipeActive={wipeActive}
        glbUrl={glbUrl}
        onWipeChange={onWipeChange}
        {...props}
      />

      <WipeHandler
        active={wipeActive}
        onProgress={onWipeChange}
      />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate={!wipeActive}
        minDistance={1.2}
        maxDistance={8}
        dampingFactor={0.08}
      />

      {/* Bottom reference circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]}>
        <ringGeometry args={[0.9, 1.05, 64]} />
        <meshBasicMaterial color="#1A1A24" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </Canvas>
  );
}
