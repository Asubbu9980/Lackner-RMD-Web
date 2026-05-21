/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { 
  CinematicCanvas, 
  CinematicCamera, 
  CinematicTooltip,
  CinematicLegend,
  CinematicLabel
} from "./CinematicSystem";

const SkylineTower = ({ position, height, color, index, fullRow, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const startTRef = useRef(-1);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const trigger = index * 0.05;
    const p = THREE.MathUtils.clamp((elapsed - trigger) * 4, 0, 1);
    if (meshRef.current) {
      meshRef.current.scale.y = p;
      meshRef.current.visible = p > 0;
      meshRef.current.material.emissiveIntensity = 0.5 + (hovered ? 3 : Math.sin(state.clock.elapsedTime * 2 + index) * 0.5);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]} 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(fullRow); }} 
        onPointerOut={() => { setHovered(false); onHover(null); }} 
        scale={[1, 0, 1]} visible={false}>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} transparent opacity={0.95} />
      </mesh>
    </group>
  );
};

const ThreeDBarChart = ({ data, formatCurrency }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const chartData = useMemo(() => {
    // Find local max for better scaling
    let localMax = 0;
    data.forEach((d) => { localMax = Math.max(localMax, d.rmd || 0, d.tax || 0, d.growth || 0); });
    
    const spacing = 28 / (data.length || 1);
    const scaleY = 14 / (localMax || 1); // Normalize to 14 units height
    
    return data.map((d, i) => ({
      ...d,
      x: (i - data.length / 2) * spacing,
      towers: [
        { key: "rmd", value: d.rmd || 0, color: "#a855f7", offsetZ: -1 },
        { key: "tax", value: d.tax || 0, color: "#ef4444", offsetZ: 0 },
        { key: "growth", value: d.growth || 0, color: "#10b981", offsetZ: 1 },
      ].map(t => ({ ...t, height: Math.max(t.value * scaleY, 0.2) }))
    }));
  }, [data]);

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const legendItems = [
    { label: "Market Growth", color: "#10b981" },
    { label: "Tax Liability", color: "#ef4444" },
    { label: "RMD Withdrawals", color: "#a855f7" }
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={[25, 20, 25]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.3} driftAmount={0} />
        <group position={[0, -7, 0]}>
          <gridHelper args={[60, 30, "#1e293b", "#0f172a"]} opacity={0.4} transparent />
          {chartData.map((d, i) => (
            <group key={i} position={[d.x, 0, 0]}>
              {d.towers.map((t, j) => (
                <SkylineTower key={j} position={[0, 0, t.offsetZ]} height={t.height} color={t.color} index={i} fullRow={d} onHover={setHoveredData} />
              ))}
              {i % 10 === 0 && (
                <Text position={[0, -1.5, 4]} fontSize={0.5} color="#94a3b8" rotation={[-Math.PI / 2, 0, 0]} fontWeight="800">
                  {d.year}
                </Text>
              )}
            </group>
          ))}
        </group>
      </CinematicCanvas>
      
      {hoveredData && (
        <CinematicTooltip 
          title={`Age ${hoveredData.age} (${hoveredData.year})`} 
          mousePos={mousePos}
          details={[
            { label: "RMD", value: hoveredData.rmd, color: "#00f2ff" },
            { label: "Tax", value: hoveredData.tax, color: "#f43f5e" },
            { label: "Growth", value: hoveredData.growth, color: "#10b981" },
            { label: "Total Balance", value: hoveredData.endBalance, color: "#38bdf8" }
          ]} 
        />
      )}

      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }}>
        <CinematicLabel  fontSize="28px" color="#fff" />
      </div>
      <CinematicLegend items={legendItems} />
    </div>
  );
};

export default ThreeDBarChart;