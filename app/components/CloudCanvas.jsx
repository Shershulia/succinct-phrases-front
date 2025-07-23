"use client";

import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { TextureLoader } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function LogoImage() {
  const texture = useLoader(TextureLoader, "/logo.png");

  return (
    <mesh position={[0, 0.65, 1]}>
      <planeGeometry args={[0.5, 0.7]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function CloudScene() {
  const meshRef = useRef();

  // Анимация пульсации
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensity = 1.2 + Math.sin(t * 2) * 1.2; // от 0 до 2.4
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <>
      {/* Зафиксированный цвет фона */}
      <color attach="background" args={["#120c1d"]} />

      <LogoImage />

      <pointLight position={[0, 3, -15]} intensity={5} distance={100} color="#ff66cc" />

      <mesh ref={meshRef} position={[0, 3, -15]}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshStandardMaterial
          emissive="#ff66cc"
          emissiveIntensity={1.2}
          color="#ff99cc"
        />
      </mesh>

      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, -10]} intensity={0.4} color="pink" />

      <EffectComposer>
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={0.5}
          width={300}
          height={300}
          kernelSize={3}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

export default function CloudCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -999, // надежно за фоном
        width: "100%",
        height: "100%",
        pointerEvents: "none", // исключено из кликов
      }}
    >
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <CloudScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
