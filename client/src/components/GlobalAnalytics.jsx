

import  { useEffect, useRef, useMemo, useState } from "react";
import { Box, Card } from "@mui/material";
import useRmd from "../hooks/useRmd";
 
const W = 1000, H = 550;
 
function drawGlobe(bgCtx, t) {
  bgCtx.clearRect(0, 0, W, H);
  const grad = bgCtx.createRadialGradient(W * 0.5, H * 0.45, 50, W * 0.5, H * 0.45, 600);
  grad.addColorStop(0, "#0a1b3d");
  grad.addColorStop(0.6, "#020c1a");
  grad.addColorStop(1, "#00050a");
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, W, H);
 
  const cx = W * 0.5, cy = H * 0.45, r = 130;
  const rot = t * 0.005;
  bgCtx.strokeStyle = "rgba(0, 200, 255, 0.08)";
  bgCtx.lineWidth = 0.5;
  for (let lat = -75; lat <= 75; lat += 25) {
    const ry = r * Math.cos((lat * Math.PI) / 180);
    const y = cy + r * Math.sin((lat * Math.PI) / 180);
    if (ry > 0) {
      bgCtx.beginPath();
      bgCtx.ellipse(cx, y, ry, ry * 0.28, 0, 0, Math.PI * 2);
      bgCtx.stroke();
    }
  }
  for (let lon = 0; lon < 180; lon += 30) {
    const angle = (lon * Math.PI) / 180 + rot;
    bgCtx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.15) {
      const x = cx + r * Math.cos(t) * Math.cos(angle);
      const y = cy + r * Math.sin(t);
      if (t === 0) bgCtx.moveTo(x, y);
      else bgCtx.lineTo(x, y);
    }
    bgCtx.stroke();
  }
}
 
function drawChart(ctx, animT, data, maxVal, hoveredIndex) {
  ctx.clearRect(0, 0, W, H);
  if (!data || data.length === 0) return;
 
  const progress = Math.min(animT / 80, 1);
  const N = data.length;
  const chartL = 80, chartR = W - 80, chartT = 160, chartB = H - 80;
  const chartW = chartR - chartL, chartH = chartB - chartT;
  const barW = (chartW / N) * 0.8;
 
  const getX = (i) => chartL + (i + 0.5) * (chartW / N);
  const getY = (v) => chartB - (v / maxVal) * chartH;
 
  // Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  ctx.textAlign = "right";
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  for (let i = 0; i <= 4; i++) {
    const v = (maxVal / 4) * i;
    const y = getY(v);
    ctx.beginPath();
    ctx.moveTo(chartL, y);
    ctx.lineTo(chartR, y);
    ctx.stroke();
    ctx.fillText(`$${(v / 1000).toFixed(0)}K`, chartL - 15, y + 4);
  }
 
  // Bars
  for (let i = 0; i < N; i++) {
    const x = getX(i);
    const rmdVal = data[i].rmd * progress;
    const taxVal = data[i].tax * progress;
    const growthVal = (data[i].growth || 0) * progress;
 
    const yRmd = getY(rmdVal);
    const yTax = getY(rmdVal + taxVal);
    const yGrowth = getY(rmdVal + taxVal + growthVal);
 
    

    // 3. GROWTH
    if (growthVal > 0) {
      const growthGrad = ctx.createLinearGradient(0, yGrowth, 0, yTax);
      growthGrad.addColorStop(0, i === hoveredIndex ? "#10b981" : "rgba(16, 185, 129, 0.7)");
      growthGrad.addColorStop(1, "rgba(16, 185, 129, 0.2)");
      ctx.fillStyle = growthGrad;
      ctx.fillRect(x - barW/2, yGrowth, barW, yTax - yGrowth);
    }
 
    // 2. TAX
    const taxGrad = ctx.createLinearGradient(0, yTax, 0, yRmd);
    taxGrad.addColorStop(0, i === hoveredIndex ? "#f43f5e" : "rgba(244, 63, 94, 0.7)");
    taxGrad.addColorStop(1, "rgba(244, 63, 94, 0.2)");
    ctx.fillStyle = taxGrad;
    ctx.fillRect(x - barW/2, yTax, barW, yRmd - yTax);
 
    // 1. RMD
    const rmdGrad = ctx.createLinearGradient(0, yRmd, 0, chartB);
    rmdGrad.addColorStop(0, i === hoveredIndex ? "#a855f7" : "rgba(168, 85, 247, 0.7)");
    rmdGrad.addColorStop(1, "rgba(168, 85, 247, 0.1)");
    ctx.fillStyle = rmdGrad;
    ctx.fillRect(x - barW/2, yRmd, barW, chartB - yRmd);
 
    ctx.fillStyle = i === hoveredIndex ? "#fff" : "rgba(255,255,255,0.4)";
    ctx.fillRect(x - barW/2, yGrowth, barW, 2);
 
    if (i % 2 === 0) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(data[i].age, x, chartB + 20);
    }
  }
 
  // Line
  const pts = data.map((d, i) => ({
    x: getX(i),
    y: getY((d.rmd + d.tax + (d.growth || 0)) * progress)
  }));
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.strokeStyle = "#00f2ff";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "rgba(0, 242, 255, 1)";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;
 
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === hoveredIndex ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  });
}
 
const AnimatedValue = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  useEffect(() => {
    const start = prevValueRef.current;
    const end = parseFloat(value?.toString().replace(/[^0-9.-]+/g, "") || "0");
    const duration = 350;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(update);
      else prevValueRef.current = end;
    };
    requestAnimationFrame(update);
  }, [value]);
  return <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(displayValue)}</span>;
};
 
export default function GlobalAnalytics() {
  const { result } = useRmd();
  const bgRef = useRef(null);
  const chartRef = useRef(null);
  const tRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
 
  const rawData = useMemo(() => {
    if (!result || !result.rows) return [];
    return result.rows;
  }, [result]);
 
  const maxVal = useMemo(() => {
    if (rawData.length === 0) return 10000;
    const m = Math.max(...rawData.map(r => r.rmd + r.tax + (r.growth || 0)));
    return Math.ceil(m / 10000) * 10000;
  }, [rawData]);
 
  const handleMouseMove = (e) => {
    const rect = chartRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
   
    const chartL = 80, chartR = W - 80, chartT = 160, chartB = H - 80;
    if (mx >= chartL && mx <= chartR && my >= chartT && my <= chartB + 40) {
      const idx = Math.floor(((mx - chartL) / (chartR - chartL)) * rawData.length);
      if (idx >= 0 && idx < rawData.length) setHoveredIndex(idx);
    } else setHoveredIndex(null);
  };
 
  useEffect(() => {
    const bgCtx = bgRef.current.getContext("2d");
    const ctx = chartRef.current.getContext("2d");
    const animate = () => {
      drawGlobe(bgCtx, tRef.current);
      drawChart(ctx, Math.min(tRef.current, 100), rawData, maxVal, hoveredIndex);
      tRef.current++;
      requestAnimationFrame(animate);
    };
    animate();
  }, [rawData, maxVal, hoveredIndex]);
 
  return (
    <Card sx={{
      width: "100%", height: 550, background: "#010205 !important",
      borderRadius: 4, overflow: "hidden", position: "relative",
      display: "flex", justifyContent: "center", border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{ position: "relative", width: "100%", height: "100%" }}
      >
        <canvas ref={bgRef} width={W} height={H} style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }} />
        <canvas ref={chartRef} width={W} height={H} style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2 }} />
 
        {/* Legend Overlay */}
        <div style={{ position: "absolute", top: 30, right: 40, zIndex: 10, display: "flex", gap: "20px" }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#10b981', borderRadius: '2px' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 800 }}>GROWTH</span>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#f43f5e', borderRadius: '2px' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 800 }}>TAX</span>
           </div>
           

           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, background: '#a855f7', borderRadius: '2px' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 800 }}>RMD</span>
           </div>
        </div>
 
        {hoveredIndex !== null && rawData[hoveredIndex] && (
          <div style={{
            position: "absolute",
            left: mousePos.x + 20 > W - 220 ? mousePos.x - 220 : mousePos.x + 20,
            top: mousePos.y < 180 ? mousePos.y + 20 : mousePos.y - 180,
            background: "rgba(8, 12, 24, 0.98)",
            backdropFilter: "blur(12px)",
            padding: "18px 22px",
            borderRadius: "14px",
            border: "1px solid rgba(0, 242, 255, 0.4)",
            color: "#fff",
            zIndex: 30,
            minWidth: "200px",
            pointerEvents: "none",
            boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
            fontFamily: "'Inter', sans-serif"
          }}>
             <div style={{ fontSize: "18px", fontWeight: 800, color: "#00f2ff", marginBottom: "8px", borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                {rawData[hoveredIndex].age} ({rawData[hoveredIndex].year})
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                   <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>GROWTH</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#10b981' }}>
                  <AnimatedValue value={rawData[hoveredIndex].growth ?? 0} />
                </span>
             </div>
 
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px #f43f5e' }} />
                   <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>TAX</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#f43f5e' }}><AnimatedValue value={rawData[hoveredIndex].tax} /></span>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px #a855f7' }} />
                   <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>RMD</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800 , color:'#a855f7'}}><AnimatedValue value={rawData[hoveredIndex].rmd} /></span>
             </div>
 
             
          </div>
        )}
      </Box>
    </Card>
  );
}
 