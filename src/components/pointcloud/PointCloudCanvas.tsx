import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { LayerGroup, ViewMode } from '../../hooks/usePointCloud';

interface PointCloudRendererProps {
  vertices: Float32Array;
  isExploded: boolean;
  layers: LayerGroup[];
  viewMode: ViewMode;
  scanActive: boolean;
}

function PointCloudRenderer({
  vertices,
  isExploded,
  layers,
  viewMode,
  scanActive,
}: PointCloudRendererProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);
  const [explosionProgress, setExplosionProgress] = useState(0);
  const targetExplosion = useRef(0);
  const { camera } = useThree();

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

        // Find which layer this vertex belongs to
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

    // Scan line animation
    if (scanLineRef.current && scanActive) {
      const t = (Date.now() * 0.001) % 2 / 2;
      scanLineRef.current.position.y = -1.25 + t * 2.5;
      scanLineRef.current.visible = true;
    } else if (scanLineRef.current) {
      scanLineRef.current.visible = false;
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
        />
      </points>

      {/* Scan line */}
      <mesh ref={scanLineRef} visible={false}>
        <planeGeometry args={[4, 0.015]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grid helper */}
      <gridHelper
        args={[4, 20, '#1A1A24', '#0D0D14']}
        position={[0, -1.3, 0]}
      />
    </group>
  );
}

interface PointCloudCanvasProps extends PointCloudRendererProps {
  onToolSelect?: (tool: string) => void;
}

export default function PointCloudCanvas(props: PointCloudCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 45, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: '#08080C' }}
    >
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.15} />

      <PointCloudRenderer {...props} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
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
