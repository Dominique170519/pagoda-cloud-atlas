import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { LayerGroup, ViewMode } from '../../hooks/usePointCloud';

/* ------------------------------------------------------------------ */
/*  Rendered GLTF model — keep native materials untouched              */
/* ------------------------------------------------------------------ */
function PagodaModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene.clone()} scale={0.9} />;
}

/* ------------------------------------------------------------------ */
/*  Scan-line glow — softer double-line effect                         */
/* ------------------------------------------------------------------ */
function ScanLine({ x, visible }: { x: number; visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.visible = visible;
      meshRef.current.position.x = x;
    }
    if (glowRef.current) {
      glowRef.current.visible = visible;
      glowRef.current.position.x = x;
    }
  });

  return (
    <group>
      {/* Core line */}
      <mesh ref={meshRef} visible={visible}>
        <planeGeometry args={[0.008, 3.2]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.9}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glow fuzz */}
      <mesh ref={glowRef} visible={visible}>
        <planeGeometry args={[0.08, 3.2]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom point shader — fade near wipe boundary                      */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vWorldX;
  uniform float uSize;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
    vWorldX = position.x;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vWorldX;
  uniform float uWipeX;
  uniform float uWipeActive;
  uniform float uFadeWidth;

  void main() {
    // Circular point shape
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float circleAlpha = 1.0 - smoothstep(0.85, 1.0, d);

    // Wipe transition zone
    float wipeAlpha = 1.0;
    if (uWipeActive > 0.5) {
      wipeAlpha = smoothstep(-uFadeWidth, uFadeWidth, vWorldX - uWipeX);
    }

    float alpha = circleAlpha * wipeAlpha * 0.78;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  PointCloud with custom shader fade                                 */
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
  wipeProgress: targetWipe,
  wipeActive,
  glbUrl,
}: PointCloudRendererProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const targetExplosion = useRef(0);
  const { gl } = useThree();

  // Smooth wipe display — lerps to target with inertia
  const smoothWipe = useRef(0.5);
  const smoothWipeX = useRef(0);
  const wipeVelocity = useRef(0);

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

  // Build shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: 0.008 },
        uWipeX: { value: 0 },
        uWipeActive: { value: 0 },
        uFadeWidth: { value: 0.18 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      shaderMaterial.dispose();
    };
  }, [shaderMaterial]);

  // Update point size based on view mode
  useFrame((_, delta) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      const targetSize = viewMode === 'cloud' ? 0.008 : 0.005;
      mat.uniforms.uSize.value += (targetSize - mat.uniforms.uSize.value) * 0.12;
    }

    // Smooth wipe animation with spring-damper
    const targetWipeX_mapped = (targetWipe - 0.5) * 4;
    const dx = targetWipeX_mapped - smoothWipeX.current;
    const stiffness = 8;
    const damping = 0.75;
    wipeVelocity.current += dx * stiffness * delta;
    wipeVelocity.current *= Math.pow(damping, 60 * delta);
    smoothWipeX.current += wipeVelocity.current * delta;

    if (wipeActive) {
      smoothWipe.current = smoothWipeX.current / 4 + 0.5; // map back to [0,1]
    }

    // Update shader uniforms
    const sm = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (sm?.uniforms) {
      sm.uniforms.uWipeX.value = smoothWipeX.current;
      sm.uniforms.uWipeActive.value = wipeActive ? 1.0 : 0.0;
    }
  });

  // Update target explosion
  useEffect(() => {
    targetExplosion.current = isExploded ? 1 : 0;
  }, [isExploded]);

  // Explosion animation in a second useFrame (we use multiple, all good)
  const explosionFrame = useRef(0);
  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const current = explosionProgress;
    const target = targetExplosion.current;
    const speed = 2.5;
    const next = current + (target - current) * Math.min(speed * delta, 1);
    explosionFrame.current = next;
    setExplosionProgress(next);

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
      const pos = pointsRef.current.geometry.attributes.position;
      const orig = geometry.attributes.position;
      for (let i = 0; i < orig.count; i++) {
        pos.setXYZ(i, orig.getX(i), orig.getY(i), orig.getZ(i));
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rendered 3D model (underneath) — keeps native textures */}
      {glbUrl && (
        <Suspense fallback={null}>
          <PagodaModel url={glbUrl} />
        </Suspense>
      )}

      {/* Point cloud with custom fade shader */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            {...geometry.attributes.position}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={shaderMaterial} attach="material" />
      </points>

      {/* Scan line at wipe boundary */}
      <ScanLine
        x={smoothWipeX.current}
        visible={wipeActive}
      />

      {/* Grid */}
      <gridHelper
        args={[4, 20, '#1A1A24', '#0D0D14']}
        position={[0, -1.3, 0]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Wipe drag handler — sets target, not position                      */
/* ------------------------------------------------------------------ */
function WipeHandler({
  active,
  currentProgress,
  onProgress,
}: {
  active: boolean;
  currentProgress: number;
  onProgress: (p: number) => void;
}) {
  const { size } = useThree();
  const dragging = useRef(false);
  const startProgress = useRef(0.5);
  const startX = useRef(0);

  // Keep startProgress in sync
  useEffect(() => {
    startProgress.current = currentProgress;
  }, [currentProgress]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const onDown = (e: MouseEvent) => {
      if (!active) return;
      dragging.current = true;
      startX.current = e.clientX;
      (e.target as HTMLElement).style.cursor = 'ew-resize';
    };

    const onMove = (e: MouseEvent) => {
      if (!active || !dragging.current) return;
      const dx = e.clientX - startX.current;
      const progress = Math.max(0, Math.min(1, startProgress.current + dx / (size.width * 0.55)));
      onProgress(progress);
    };

    const onUp = () => {
      dragging.current = false;
      if (active) {
        const c = document.querySelector('canvas') as HTMLElement;
        if (c) c.style.cursor = 'ew-resize';
      }
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

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
  }, [active, size.width, onProgress, currentProgress]);

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
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} />
      <directionalLight position={[0, -1, 3]} intensity={0.35} />

      <PointCloudRenderer
        wipeProgress={wipeProgress}
        wipeActive={wipeActive}
        glbUrl={glbUrl}
        onWipeChange={onWipeChange}
        {...props}
      />

      <WipeHandler
        active={wipeActive}
        currentProgress={wipeProgress}
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
