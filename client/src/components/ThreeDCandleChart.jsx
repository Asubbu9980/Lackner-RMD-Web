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

const Candle = ({ x, open, close, high, low, color, details = {}, index, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const startTRef = useRef(-1);
  const bodyRef = useRef();

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const trigger = index * 0.1;
    const p = THREE.MathUtils.clamp((elapsed - trigger) * 4, 0, 1);
    if (bodyRef.current) { bodyRef.current.scale.y = p; bodyRef.current.visible = p > 0; }
  });

  const bodyHeight = Math.max(Math.abs(close - open), 0.2);
  const bodyCenter = (open + close) / 2;
  const wickHeight = Math.max(Math.abs(high - low), 0.1);

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, (high + low) / 2, 0]}><cylinderGeometry args={[0.02, 0.02, wickHeight, 8]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh ref={bodyRef} position={[0, bodyCenter, 0]} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(details); }} onPointerOut={() => { setHovered(false); onHover(null); }} scale={[1,0,1]} visible={false}>
        <boxGeometry args={[0.45, bodyHeight, 0.45]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1 : 0.2} metalness={0.5} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

const ThreeDCandleChart = ({ data }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const candleData = useMemo(() => {
    const visible = data.slice(0, 24);
    const spacing = 22 / (visible.length || 1);
    return visible.map((d, i) => {
      const base = (d.balance || d.endBalance || 0) / 100000;
      const open = base * (0.9 + Math.sin(i * 0.5) * 0.1);
      const close = base * (1.1 + Math.cos(i * 0.5) * 0.1);
      return { ...d, x: (i - visible.length / 2) * spacing, open, close, high: Math.max(open, close) + 0.8, low: Math.min(open, close) - 0.8, color: close > open ? "#10b981" : "#f43f5e" };
    });
  }, [data]);

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={[20, 10, 20]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.3} driftAmount={0} />
        <group position={[0, -4, 0]}>
          <gridHelper args={[40, 20, "#1e293b", "#0f172a"]} />
          {candleData.map((d, i) => (
            <group key={i}>
              <Candle {...d} details={d} index={i} onHover={setHoveredData} />
              {i % 4 === 0 && <Text position={[d.x, -1.2, 2]} fontSize={0.3} color="#475569" rotation={[-Math.PI / 2, 0, 0]}>{d.year}</Text>}
            </group>
          ))}
        </group>
      </CinematicCanvas>
      
      {hoveredData && (
        <CinematicTooltip 
          title={`Age ${hoveredData.age} (${hoveredData.year})`} 
          mousePos={mousePos}
          details={[
            { label: "Closing Balance", value: hoveredData.balance || hoveredData.endBalance, color: hoveredData.color }
          ]} 
        />
      )}

      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }}>
        <CinematicLabel fontSize="28px" color="#fff" />
      </div>
      <CinematicLegend items={[{ label: "Positive Movement", color: "#10b981" }, { label: "Negative Movement", color: "#f43f5e" }]} />
    </div>
  );
};

export default ThreeDCandleChart;