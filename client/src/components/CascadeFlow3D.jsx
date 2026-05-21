/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import useRmd from "../hooks/useRmd";
import { 
  CinematicCanvas, 
  CinematicCamera, 
  CinematicTooltip,
  CinematicLegend,
  CinematicLabel
} from "./CinematicSystem";

const normalize = (value, max, width) => {
  if (!max || max === 0) return 0;
  return (value / max) * width;
};

// ======================================================
// MILESTONE MARKER
// ======================================================

const MilestoneMarker = ({ pos, row, index, total, progress, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const trigger = index / total;
      const p = THREE.MathUtils.clamp((progress - trigger) * 4, 0, 1);
      groupRef.current.visible = p > 0;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, p, 0.1));
    }
  });

  return (
    <group ref={groupRef} visible={false} scale={[0,0,0]}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={pos}>
          <mesh onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(row); }} onPointerOut={() => { setHovered(false); onHover(null); }}>
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          <mesh>
            <sphereGeometry args={[hovered ? 0.25 : 0.12, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#00f2ff" emissiveIntensity={hovered ? 10 : 2} metalness={1} roughness={0} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// ======================================================
// PROJECTION SCENE
// ======================================================

const ProjectionScene = ({ data, maxBalance, width, amplitude, onHover }) => {
  const areaRef = useRef();
  const startTRef = useRef(-1);
  const [progress, setProgress] = useState(0);

  const points = useMemo(() => {
    return data.map((row, i) => {
      const t = i / (data.length - 1);
      const x = t * width - width / 2;
      return [x, (row.endBalance / maxBalance) * amplitude, 0];
    });
  }, [data, maxBalance]);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const p = THREE.MathUtils.clamp(elapsed / 3, 0, 1);
    setProgress(p);
    
    if (areaRef.current) {
      areaRef.current.visible = p > 0.5;
      areaRef.current.scale.y = THREE.MathUtils.lerp(areaRef.current.scale.y, p > 0.5 ? 1 : 0, 0.1);
    }
  });

  const areaGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], 0);
    points.forEach(p => s.lineTo(p[0], p[1]));
    s.lineTo(points[points.length - 1][0], 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [points]);

  return (
    <group>
      <mesh ref={areaRef} geometry={areaGeometry} scale={[1, 0, 1]} visible={false}>
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      <Line points={points} color="#00f2ff" lineWidth={3} transparent opacity={0.9} />
      {data.map((row, i) => {
        if (i % 10 !== 0) return null;
        return <MilestoneMarker key={i} pos={points[i]} row={row} index={i} total={data.length} progress={progress} onHover={onHover} />;
      })}
    </group>
  );
};

// ======================================================
// WATERFALL 3D BAR
// ======================================================

const WaterfallBar = ({ row, maxVal, width, index, onHover }) => {
  const [hovered, setHovered] = useState(null);
  const startTRef = useRef(-1);
  const meshRefs = useRef([]);

  useFrame((state) => {
    if (startTRef.current === -1) startTRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTRef.current;
    const trigger = index * 0.1;
    const p = THREE.MathUtils.clamp((elapsed - trigger) * 4, 0, 1);
    meshRefs.current.forEach(m => { if (m) { m.scale.y = p; m.visible = p > 0; } });
  });

  const segments = useMemo(() => {
    const growth = row.growth || 0;
    const tax = row.tax || 0;
    const rmd = row.rmd || 0;
    const end = row.endBalance || 0;
    const start = row.startBalance || (end - growth + tax + rmd);
    return [
      { width: normalize(start, maxVal, width), color: "#a3e635", key: "startBalance", label: "Start Balance" },
      { width: normalize(growth, maxVal, width), color: "#10b981", key: "growth", label: "Growth" },
      { width: normalize(tax, maxVal, width), color: "#f43f5e", key: "tax", label: "Tax" },
      { width: normalize(rmd, maxVal, width), color: "#a855f7", key: "rmd", label: "RMD" }
    ];
  }, [row, maxVal, width]);

  let currentX = -width / 2;

  return (
    <group position={[0, -index * 0.45, 0]}>
      {segments.map((seg, i) => {
        const segWidth = seg.width;
        const pos = currentX + segWidth / 2;
        currentX += segWidth;
        if (segWidth < 0.01) return null;
        return (
          <mesh 
            key={seg.key} ref={el => meshRefs.current[i] = el} position={[pos, 0, 0]} 
            onPointerOver={(e) => { e.stopPropagation(); setHovered(seg.key); onHover(row); }} 
            onPointerOut={() => { setHovered(null); onHover(null); }}
            scale={[1, 0, 1]} visible={false}
          >
            <boxGeometry args={[segWidth, 0.35, 0.1]} />
            <meshStandardMaterial color={seg.color} emissive={seg.color} emissiveIntensity={hovered === seg.key ? 2 : 0.4} metalness={0.8} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
};

const CascadeFlow3D = ({ mode = "PROJECTION" }) => {
  const { result } = useRmd();
  const data = useMemo(() => result?.rows || [], [result]);
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!data.length) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const legendItems = mode === "PROJECTION" 
    ? [{ label: "Wealth Stream", color: "#00f2ff" }, { label: "Milestones", color: "#ffffff" }]
    : [{ label: "Start Balance", color: "#a3e635" }, { label: "Growth", color: "#10b981" }, { label: "Taxes", color: "#f43f5e" }, { label: "RMDs", color: "#a855f7" }];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#010409" }}>
      <CinematicCanvas cameraPos={mode === "WATERFALL" ? [12, 5, 20] : [0, 5, 20]} onMouseMove={handleMouseMove}>
        <CinematicCamera orbitSpeed={0.3} driftAmount={0} />
        <group position={[0, mode === "WATERFALL" ? 8 : -3, 0]}>
          <gridHelper args={[80, 40, "#1e293b", "#0f172a"]} rotation={[mode === "WATERFALL" ? Math.PI/2 : 0, 0, 0]} opacity={0.2} transparent />
          {mode === "PROJECTION" ? (
             <ProjectionScene data={data} maxBalance={Math.max(...data.map(d => d.endBalance || 0), 1)} width={20} amplitude={7} onHover={setHoveredData} />
          ) : (
             <group>{data.map((row, i) => <WaterfallBar key={i} row={row} maxVal={Math.max(...data.map(d => d.endBalance || 0), 1) * 1.1} width={20} index={i} onHover={setHoveredData} />)}</group>
          )}
        </group>
      </CinematicCanvas>
      
      {hoveredData && (
        <CinematicTooltip 
          title={`Age ${hoveredData.age} (${hoveredData.year})`} 
          mousePos={mousePos}
          details={[
            { label: "End Balance", value: hoveredData.endBalance, color: "#00f2ff" },
            { label: "Growth", value: hoveredData.growth, color: "#10b981" },
            { label: "Tax", value: hoveredData.tax, color: "#f43f5e" },
            { label: "RMD", value: hoveredData.rmd, color: "#a855f7" }
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

export default CascadeFlow3D;