import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene.clone()} scale={1} />
    </group>
  );
}

export default function ModelPreview({ url }: { url: string }) {
  return (
    <div className="w-full aspect-[3/4] lg:aspect-[4/5] rounded-xl overflow-hidden bg-ink-900/[0.02] border border-ink-900/5">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-ink-300 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-ink-400 font-mono">加载中...</span>
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0.3, 2.5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <directionalLight position={[-3, 3, -3]} intensity={0.4} />
          <Model url={url} />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.3}
            scale={4}
            blur={3}
            far={4}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
