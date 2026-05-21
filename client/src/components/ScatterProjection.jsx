/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import useRmd from "../hooks/useRmd";
import { 
  CinematicCanvas, 
  CinematicCamera, 
  CinematicTooltip,
  CinematicLegend,
  CinematicLabel
} from "./CinematicSystem";

const OrbitalPoint = ({ position, color, index, fullRow, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const startTRef = useRef(-1);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const trigger = index * 0.05;
    const p = THREE.MathUtils.clamp((elapsed - trigger) * 4, 0, 1);
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar(p);
      meshRef.current.visible = p > 0;
      if (p > 0) {
        const t = state.clock.elapsedTime;
        const orbitSpeed = 1 + (index % 5) * 0.2;
        meshRef.current.position.y = position[1] + Math.sin(t * orbitSpeed + index) * 0.2;
        meshRef.current.position.z = position[2] + Math.cos(t * orbitSpeed + index) * 0.2;
        meshRef.current.material.emissiveIntensity = 2 + (hovered ? 10 : Math.sin(t * 3 + index) * 1);
      }
    }
  });

  return (
    <group>
      <mesh position={position} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(fullRow); }} onPointerOut={() => { setHovered(false); onHover(null); }}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={meshRef} position={position} scale={[0,0,0]} visible={false}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

const ScatterProjection = () => {
  const { result } = useRmd();
  const data = useMemo(() => result?.rows || [], [result]);
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const chartData = useMemo(() => {
    let max = 0;
    data.forEach((d) => { max = Math.max(max, d.rmd, d.tax, d.growth); });
    const spacing = 26 / (data.length || 1);
    const scaleY = 12 / (max || 1);
    return data.map((d, i) => ({
      ...d,
      x: (i - data.length / 2) * spacing,
      points: [
        { key: "rmd", value: d.rmd, color: "#a855f7", offsetZ: -1.5 },
        { key: "tax", value: d.tax, color: "#ef4444", offsetZ: 0 },
        { key: "growth", value: d.growth, color: "#10b981", offsetZ: 1.5 },
      ].map(p => ({ ...p, y: p.value * scaleY }))
    }));
  }, [data]);

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={[25, 15, 25]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.5} driftAmount={0} />
        <group position={[0, -6, 0]}>
          <gridHelper args={[60, 30, "#1e293b", "#0f172a"]} opacity={0.1} transparent />
          {chartData.map((d, i) => (
            <group key={i} position={[d.x, 0, 0]}>
              {d.points.map((p, j) => <OrbitalPoint key={j} position={[0, p.y, p.offsetZ]} color={p.color} index={i + j} fullRow={d} onHover={setHoveredData} />)}
              {i % 10 === 0 && <Text position={[0, -1.5, 4]} fontSize={0.4} color="#64748b" rotation={[-Math.PI / 2, 0, 0]} fontWeight="800">{d.year}</Text>}
            </group>
          ))}
        </group>
      </CinematicCanvas>
      
      {hoveredData && (
        <CinematicTooltip 
          title={`Age ${hoveredData.age} (${hoveredData.year})`} 
          mousePos={mousePos}
          details={[
            { label: "RMD", value: hoveredData.rmd, color: "#a855f7" },
            { label: "Tax", value: hoveredData.tax, color: "#ef4444" },
            { label: "Growth", value: hoveredData.growth, color: "#10b981" },
            { label: "Balance", value: hoveredData.endBalance, color: "#38bdf8" }
          ]} 
        />
      )}

      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }}>
        <CinematicLabel  fontSize="28px" color="#fff" />
      </div>
      <CinematicLegend items={[{ label: "Market Growth", color: "#10b981" }, { label: "Tax Liability", color: "#ef4444" }, { label: "RMD Withdrawals", color: "#a855f7" }]} />
    </div>
  );
};

export default ScatterProjection;