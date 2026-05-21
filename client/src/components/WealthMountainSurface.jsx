/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { 
  CinematicCanvas, 
  CinematicCamera, 
  CinematicTooltip,
  CinematicLegend,
  CinematicLabel
} from "./CinematicSystem";

const MilestonePoint = ({ pos, row, index, total, progress, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const trigger = index / total;
      const p = THREE.MathUtils.clamp((progress - trigger) * 4, 0, 1);
      groupRef.current.visible = p > 0;
      groupRef.current.children[1].material.emissiveIntensity = 2 + (hovered ? 10 : Math.sin(state.clock.elapsedTime * 3 + index) * 1.5);
    }
  });

  return (
    <group ref={groupRef} position={pos} visible={false}>
      <mesh onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(row); }} onPointerOut={() => { setHovered(false); onHover(null); }}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh>
        <sphereGeometry args={[hovered ? 0.3 : 0.15, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={2} metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

const MountainScene = ({ data, balances, maxBalance, geometry, onHover }) => {
  const startTRef = useRef(-1);
  const meshRef = useRef();
  const wireRef = useRef();
  const [progress, setProgress] = useState(0);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const p = THREE.MathUtils.clamp(elapsed / 3, 0, 1);
    setProgress(p);
    
    if (meshRef.current) { meshRef.current.scale.z = p; meshRef.current.visible = p > 0; }
    if (wireRef.current) { wireRef.current.scale.z = p; wireRef.current.visible = p > 0; wireRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1; }
  });

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <mesh ref={meshRef} geometry={geometry} scale={[1, 1, 0]} visible={false}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} metalness={1} roughness={0} transparent opacity={0.6} />
      </mesh>
      <mesh ref={wireRef} geometry={geometry} scale={[1, 1, 0]} visible={false}>
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
      </mesh>
      
      {data.map((d, i) => {
        if (i % 20 !== 0) return null;
        const x = (i / (data.length - 1)) * 26 - 13;
        const y = (balances[i] / maxBalance) * 8;
        return (
          <group key={i} position={[x, 0, y + 0.2]}>
            <MilestonePoint pos={[0, 0, 0]} row={d} index={i} total={data.length} progress={progress} onHover={onHover} />
            <Text position={[0, -1.2, 0]} fontSize={0.45} color="#94a3b8" rotation={[Math.PI / 2, 0, 0]} fontWeight="800">{d.year}</Text>
          </group>
        );
      })}
    </group>
  );
};

const WealthMountainSurface = ({ data = [] }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { balances, maxBalance, geometry } = useMemo(() => {
    const b = data.map(d => Number(d.balance || d.endBalance || 0));
    const maxB = Math.max(...b, 1);
    const geo = new THREE.PlaneGeometry(26, 18, 40, 30);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const normX = (x + 13) / 26;
      const idx = Math.floor(normX * (b.length - 1));
      pos.setZ(i, (b[idx] / maxB) * 8);
    }
    geo.computeVertexNormals();
    return { balances: b, maxBalance: maxB, geometry: geo };
  }, [data]);

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const legendItems = [{ label: "Wealth Topography", color: "#0ea5e9" }, { label: "Principal Milestones", color: "#ffffff" }];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={[25, 25, 25]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.3} driftAmount={0} />
        <MountainScene data={data} balances={balances} maxBalance={maxBalance} geometry={geometry} onHover={setHoveredData} />
      </CinematicCanvas>

      {hoveredData && (
        <CinematicTooltip 
          title={`Age ${hoveredData.age} (${hoveredData.year})`} 
          mousePos={mousePos}
          details={[{ label: "Principal Balance", value: hoveredData.endBalance, color: "#38bdf8" }]} 
        />
      )}

      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }}>
        <CinematicLabel  fontSize="28px" color="#fff" />
      </div>
      <CinematicLegend items={legendItems} />
    </div>
  );
};

export default WealthMountainSurface;