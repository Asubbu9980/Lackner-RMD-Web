/* eslint-disable react-hooks/immutability */
 
/* eslint-disable no-unused-vars */
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { 
  CinematicCanvas, 
  CinematicCamera, 
  CinematicTooltip,
  CinematicLegend,
  CinematicLabel
} from "./CinematicSystem";

const OrbitalSlice = ({ startAngle, endAngle, color, label, value, index, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const startTRef = useRef(-1);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const trigger = index * 0.3;
    const p = THREE.MathUtils.clamp((elapsed - trigger) * 4, 0, 1);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(p);
      meshRef.current.visible = p > 0;
      meshRef.current.material.emissiveIntensity = 0.2 + (hovered ? 1.5 : Math.sin(state.clock.elapsedTime * 2 + index) * 0.2);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, hovered ? 0.5 : 0, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover({ label, value, color }); }} 
      onPointerOut={() => { setHovered(false); onHover(null); }} 
      scale={[0,0,0]} visible={false}>
      <extrudeGeometry args={[
        useMemo(() => {
          const s = new THREE.Shape();
          s.moveTo(0, 0); s.absarc(0, 0, 4.5, startAngle, endAngle, false); s.lineTo(0, 0);
          return s;
        }, [startAngle, endAngle]),
        { depth: 1.2, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 }
      ]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={1} roughness={0} transparent opacity={0.85} />
    </mesh>
  );
};

const PieChart3D = ({ data }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filteredData = useMemo(() => data.filter(d => d.value > 0), [data]);
  const total = useMemo(() => filteredData.reduce((sum, d) => sum + d.value, 0), [filteredData]);
  const slices = useMemo(() => {
    let currentAngle = 0;
    return filteredData.map((d) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      const lower = d.label.toLowerCase();
      // Reverting to legacy palette: RMD=Purple, Tax=Red, Growth=Green
      const color = lower.includes("tax") ? "#ef4444" : lower.includes("growth") ? "#10b981" : lower.includes("withdraw") || lower.includes("rmd") ? "#a855f7" : "#00f2ff";
      const result = { ...d, startAngle: currentAngle, endAngle: currentAngle + sliceAngle, color };
      currentAngle += sliceAngle;
      return result;
    });
  }, [filteredData, total]);

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const legendItems = slices.map(s => ({ label: s.label, color: s.color }));

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={[0, 18, 28]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.4} driftAmount={0} />
        <group position={[0, -1, 0]}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
             {slices.map((slice, i) => <OrbitalSlice key={i} index={i} {...slice} onHover={setHoveredData} />)}
             <mesh position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={4} metalness={1} roughness={0} />
             </mesh>
          </Float>
          {slices.map((slice, i) => (
            <Text key={`label-${i}`} position={[Math.cos(slice.startAngle + (slice.endAngle - slice.startAngle) / 2) * 6.5, 1, Math.sin(slice.startAngle + (slice.endAngle - slice.startAngle) / 2) * 6.5]} fontSize={0.4} color="#fff" fontWeight="800">
              {slice.label}
            </Text>
          ))}
        </group>
      </CinematicCanvas>
      
      {hoveredData && (
        <CinematicTooltip title={hoveredData.label} mousePos={mousePos} details={[{ label: "Value", value: hoveredData.value, color: hoveredData.color }]} />
      )}

      <div style={{ position: "absolute", top: "40px", left: "40px", pointerEvents: "none" }}>
        <CinematicLabel  fontSize="28px" color="#fff" />
      </div>
      <CinematicLegend items={legendItems} />
    </div>
  );
};

export default PieChart3D;