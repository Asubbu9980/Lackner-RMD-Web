import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import * as THREE from "three";

function AnimatedCurve() {
  const group = useRef();

  useFrame(({ clock }) => {
    group.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.3) * 0.15;
  });

  const points = [
    [-5, -2, 0],
    [-3, -1, 0.5],
    [-1, 1, 1],
    [1, 0.3, 1.2],
    [3, 1.5, 1.5],
    [5, 3, 2],
  ];

  return (
    <group ref={group}>
      <Line
        points={points}
        color="#38bdf8"
        lineWidth={4}
      />

      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#38bdf8"
            emissiveIntensity={3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroFinancialGraph() {
  return (
    <div className="h-[520px] w-full rounded-[32px] overflow-hidden bg-[#020617]">
      <Canvas camera={{ position: [0, 1, 10], fov: 50 }}>
        <ambientLight intensity={1.5} />

        <pointLight
          position={[5, 5, 5]}
          intensity={10}
          color="#38bdf8"
        />

        <gridHelper args={[20, 20, "#0ea5e9", "#082f49"]} />

        <AnimatedCurve />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}