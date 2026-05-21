/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
 
/* eslint-disable no-unused-vars */
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  Float,
  Stars,
  PointMaterial,
  Points
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

export const CinematicCamera = ({ orbitSpeed = 0.5, driftAmount = 0.5 }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame((state) => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = orbitSpeed;
      controlsRef.current.update();
    }
  });

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 4} makeDefault />;
};

const CinematicParticles = ({ count = 400 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return p;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.z += 0.0005;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={points}>
        <PointMaterial transparent color="#38bdf8" size={0.08} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.4} />
      </Points>
    </group>
  );
};

export const CinematicTooltip = ({ title, details = [], mousePos = { x: 0, y: 0 } }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setPos(mousePos);
  }, [mousePos]);

  return (
    <div style={{
      position: "absolute",
      left: pos.x + 20,
      top: pos.y + 20,
      background: "rgba(8, 12, 24, 0.98)",
      backdropFilter: "blur(12px)",
      padding: "18px 22px",
      borderRadius: "14px",
      border: "1px solid rgba(0, 242, 255, 0.4)",
      color: "#fff",
      zIndex: 2000,
      minWidth: "220px",
      pointerEvents: "none",
      boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
      fontFamily: "'Inter', sans-serif",
      transform: "translate(0, 0)"
    }}>
      <div style={{ 
        fontSize: "18px", 
        fontWeight: 800, 
        color: "#00f2ff", 
        marginBottom: "12px", 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        paddingBottom: '8px' 
      }}>
        {title}
      </div>

      {details.map((item, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: i === details.length - 1 ? 0 : '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color || '#fff', boxShadow: `0 0 8px ${item.color || '#fff'}` }} />
             <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: item.color || '#fff' }}>
             {typeof item.value === 'number' ? `$${Math.round(item.value).toLocaleString()}` : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const CinematicLabel = ({ text, color = "#ffffff", fontSize = "14px" }) => {
  return (
    <div style={{ color, fontSize, fontWeight: "800", fontFamily: "'Inter', sans-serif", textShadow: "0 4px 12px rgba(0,0,0,0.5)", whiteSpace: "nowrap", letterSpacing: "-0.5px" }}>
      {text}
    </div>
  );
};

export const CinematicLegend = ({ items }) => {
  return (
    <div style={{ 
      position: "absolute", bottom: "40px", right: "40px", display: "flex", flexDirection: "column", gap: "12px", 
      background: "rgba(10, 15, 28, 0.85)", backdropFilter: "blur(24px)", padding: "24px", borderRadius: "20px", 
      border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.8)", zIndex: 1000, pointerEvents: "none"
    }}>
      <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", letterSpacing: "2.5px", marginBottom: "12px", textTransform: "uppercase" }}>Analytics Key</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: item.color, boxShadow: `0 0 20px ${item.color}60` }} />
          <span style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.2px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export const CinematicCanvas = ({ children, cameraPos = [0, 8, 20], onMouseMove, ...props }) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }} onMouseMove={onMouseMove}>
      <Canvas
        gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
        dpr={[1, 2]}
        camera={{ position: cameraPos, fov: 45 }}
        style={{ background: "#010409", width: "100%", height: "100%", borderRadius: "20px" }}
      >
        <color attach="background" args={["#010409"]} />
        <Environment preset="city" />
        <ambientLight intensity={1.5} />
        <spotLight position={[20, 30, 20]} angle={0.3} penumbra={1} intensity={5} color="#ffffff" castShadow />
        <pointLight position={[-15, -15, -15]} color="#f43f5e" intensity={2} />
        
        <CinematicParticles count={300} />
        <Stars radius={120} depth={60} count={6000} factor={5} saturation={0} fade speed={1.5} />
        
        {children}

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={400} intensity={2.0} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
