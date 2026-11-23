"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export interface PointCloudCameraState {
  morph: number; // 0 = cutout photo visible, 1 = solid 3D point-cloud
  zoom: number; // 1.0 -> 2.65
  panX: number; // NDC X offset
  panY: number; // NDC Y offset
  rotY: number; // Y-axis 3D rotation
  rotX: number; // X-axis 3D tilt
  mouseX: number; // normalized pointer X (-1..1)
  mouseY: number; // normalized pointer Y (-1..1)
  swirlPulse: number; // 0..1 organic turbulence during morphs
  themeMix: number; // 0 = Light Mode (Pristine Light Yellow + Gold-Amber Depth), 1 = Dark Mode (Dark Neon)
  dofStrength: number; // 0..1 optical Z-depth-of-field bokeh strength
  focusDepth: number; // Z focal plane (~0.13 on Birky's face)
  exitFade: number; // 1 -> 0 soft scatter fade at runway end
}

interface HeroPointCloudProps {
  cameraRef: MutableRefObject<PointCloudCameraState>;
}

interface SampledPoints {
  positions: Float32Array;
  metas: Float32Array;
  alphas: Float32Array;
  count: number;
  imgAspect: number;
}

const VERTEX_SHADER_SRC = `
  attribute vec3 aPos;
  attribute vec3 aMeta;
  attribute float aAlpha;

  uniform float uTime;
  uniform float uMorph;
  uniform float uZoom;
  uniform float uPanX;
  uniform float uPanY;
  uniform float uRotY;
  uniform float uRotX;
  uniform float uAspect;
  uniform float uCoverFactor;
  uniform float uDpr;
  uniform float uViewportH;
  uniform vec2 uMouse;
  uniform float uSwirlPulse;
  uniform float uThemeMix;
  uniform float uDofStrength;
  uniform float uFocusDepth;
  uniform float uExitFade;

  varying float vLum;
  varying float vAccent;
  varying float vAlpha;
  varying float vDepth;
  varying float vEdgeGlow;
  varying float vCoc;

  void main() {
    float lum = aMeta.x;
    float accent = aMeta.y;
    float seed = aMeta.z;

    vec3 p = aPos;

    // Gentle living breathing + dispersion wave on transition and exit
    float exitDisp = (1.0 - uExitFade) * 0.42;
    float scatterAmp = (1.0 - uMorph) * 0.34 + uSwirlPulse * 0.08 + exitDisp;
    float phase = seed * 6.2831853 + uTime * 1.25;
    float waveX = sin(p.y * 7.2 + phase) * cos(p.x * 5.0 - uTime * 0.85);
    float waveY = cos(p.x * 6.5 + phase * 0.85) * 0.7;
    float waveZ = sin((p.x + p.y) * 8.0 + uTime * 1.15);

    p.x += waveX * (0.002 + scatterAmp * (0.34 + seed * 0.6));
    p.y += waveY * (0.002 + scatterAmp * (0.28 + seed * 0.5)) + exitDisp * (0.18 + seed * 0.25);
    p.z += waveZ * (0.004 + scatterAmp * 0.38);

    // 3D Rotation around Y then X
    float cy = cos(uRotY);
    float sy = sin(uRotY);
    vec3 rY = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);

    float cx = cos(uRotX);
    float sx = sin(uRotX);
    vec3 rYX = vec3(rY.x, rY.y * cx - rY.z * sx, rY.y * sx + rY.z * cx);

    // Subtle cursor repulsion swirl
    float projBase = 2.0 * uCoverFactor * uZoom;
    vec2 preNdc = vec2((rYX.x * projBase) / uAspect + uPanX, rYX.y * projBase + uPanY);
    vec2 mouseVec = preNdc - uMouse;
    mouseVec.x *= uAspect;
    float mDist = length(mouseVec);
    float repulse = smoothstep(0.32, 0.0, mDist) * (0.017 / max(uZoom, 0.75)) * (0.4 + 0.6 * uMorph);
    if (mDist > 0.0001) {
      vec2 dir = normalize(mouseVec);
      rYX.x += dir.x * repulse * 0.65 + waveX * repulse * 0.35;
      rYX.y += dir.y * repulse * 0.65 + waveY * repulse * 0.35;
      rYX.z += repulse * 1.35;
    }

    // Optical Depth-of-Field Circle of Confusion around uFocusDepth
    float coc = clamp(abs(rYX.z - uFocusDepth) * 3.6 * uDofStrength, 0.0, 1.0);
    vCoc = coc;

    float camDist = 3.0;
    float persp = camDist / max(0.55, camDist - rYX.z * (0.65 + 0.35 * min(uZoom, 2.5)));

    vec2 ndc = vec2(
      ((rYX.x * projBase) / uAspect) * persp + uPanX,
      (rYX.y * projBase) * persp + uPanY
    );

    gl_Position = vec4(ndc, clamp(-rYX.z * 0.45, -0.95, 0.95), 1.0);

    // Out-of-focus depth particles expand smoothly into soft optical bokeh discs
    float gridPx = (uViewportH * uCoverFactor / 270.0) * uZoom * uDpr;
    float lumScale = 0.72 + 0.30 * lum + 0.16 * accent;
    float dofScale = 1.0 + coc * 2.0;
    gl_PointSize = clamp(gridPx * 0.94 * lumScale * persp * dofScale, 1.4 * uDpr, 16.0 * uDpr);

    vLum = lum;
    vAccent = accent;
    vAlpha = aAlpha * smoothstep(0.02, 0.24, uMorph) * uExitFade;
    vDepth = clamp(rYX.z + 0.5, 0.0, 1.0);
    vEdgeGlow = clamp(repulse * 18.0 + uSwirlPulse * 0.42, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;

  uniform float uThemeMix;

  varying float vLum;
  varying float vAccent;
  varying float vAlpha;
  varying float vDepth;
  varying float vEdgeGlow;
  varying float vCoc;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float boxDist = max(abs(coord.x), abs(coord.y));
    float circleDist = length(coord);

    // Blend smoothly from crisp square pixel dot (in-focus) to circular optical bokeh disc (out-of-focus)
    float dist = mix(boxDist, circleDist, vCoc);
    if (dist > 0.48) discard;

    float sharpness = mix(0.36, 0.10, vCoc);
    float shapeMask = 1.0 - smoothstep(sharpness, 0.48, dist);
    float bokehAtten = 1.0 - vCoc * 0.54;

    // 1) LIGHT MODE PALETTE: Pristine Light Yellow + Warm Sunlit Gold-Amber Depth Contours
    vec3 lightCore = vec3(0.996, 0.941, 0.541);    // #FEF08A Pristine Light Yellow
    vec3 canaryGlow = vec3(0.992, 0.878, 0.278);   // #FDE047 Vivid Canary
    vec3 warmGold = vec3(0.792, 0.541, 0.016);     // #CA8A04 Gold-Amber Contour
    vec3 deepAmber = vec3(0.510, 0.298, 0.039);    // #824C0A Crisp Facial/Eye Relief

    float contourMix = smoothstep(0.26, 0.84, 1.0 - vLum);
    vec3 lightShade = mix(lightCore, warmGold, contourMix * 0.85);
    lightShade = mix(lightShade, deepAmber, smoothstep(0.65, 0.96, 1.0 - vLum) * 0.72);
    lightShade = mix(lightShade, canaryGlow, clamp(vAccent * 0.68 + vEdgeGlow * 0.35, 0.0, 0.85));

    // 2) DARK MODE PALETTE: Dark Neon (Ice-White + Neon Cyan #00F0FF + Electric Indigo #455CE9 + Violet)
    vec3 iceWhite = vec3(0.95, 0.98, 1.0);
    vec3 neonCyan = vec3(0.0, 0.94, 1.0);
    vec3 electricIndigo = vec3(0.271, 0.361, 0.914);
    vec3 neonViolet = vec3(0.486, 0.227, 0.929);

    vec3 darkBase = iceWhite * (0.48 + 0.65 * vLum);
    vec3 neonRim = mix(electricIndigo, mix(neonCyan, neonViolet, 0.35 + 0.35 * sin(vDepth * 3.14)), clamp(vDepth, 0.0, 1.0));
    vec3 darkCol = mix(darkBase, neonRim, clamp(vAccent * 0.90 + vEdgeGlow * 0.50, 0.0, 0.96));
    darkCol += neonCyan * (vDepth * 0.08);

    vec3 finalCol = mix(lightShade, darkCol, uThemeMix);

    float lightAlpha = vAlpha * shapeMask * bokehAtten * (0.64 + 0.36 * (1.0 - vLum * 0.32));
    float darkAlpha = vAlpha * shapeMask * bokehAtten * (0.46 + 0.54 * vLum);
    float finalAlpha = mix(lightAlpha, darkAlpha, uThemeMix);

    gl_FragColor = vec4(finalCol, finalAlpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hashSeed(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function HeroPointCloud({ cameraRef }: HeroPointCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<SampledPoints | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId = 0;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });

    const ctx2d = !gl ? canvas.getContext("2d") : null;

    let program: WebGLProgram | null = null;
    let posBuffer: WebGLBuffer | null = null;
    let metaBuffer: WebGLBuffer | null = null;
    let alphaBuffer: WebGLBuffer | null = null;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    let attrs = { aPos: -1, aMeta: -1, aAlpha: -1 };

    if (gl) {
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            attrs = {
              aPos: gl.getAttribLocation(program, "aPos"),
              aMeta: gl.getAttribLocation(program, "aMeta"),
              aAlpha: gl.getAttribLocation(program, "aAlpha"),
            };
            const names = [
              "uTime",
              "uMorph",
              "uZoom",
              "uPanX",
              "uPanY",
              "uRotY",
              "uRotX",
              "uAspect",
              "uCoverFactor",
              "uDpr",
              "uViewportH",
              "uMouse",
              "uSwirlPulse",
              "uThemeMix",
              "uDofStrength",
              "uFocusDepth",
              "uExitFade",
            ];
            names.forEach((name) => {
              if (program) {
                uniforms[name] = gl.getUniformLocation(program, name);
              }
            });
          } else {
            gl.deleteProgram(program);
            program = null;
          }
        }
      }
    }

    const img = new Image();
    img.src = "/hero-pointcloud-map.png";
    img.onload = () => {
      if (disposed) return;
      const off = document.createElement("canvas");
      off.width = img.width;
      off.height = img.height;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0);
      const data = offCtx.getImageData(0, 0, img.width, img.height).data;
      const imgAspect = img.width / img.height;

      const tmpPos: number[] = [];
      const tmpMeta: number[] = [];
      const tmpAlpha: number[] = [];
      const step = gl && program ? 1 : 2;

      for (let py = 0; py < img.height; py += step) {
        for (let px = 0; px < img.width; px += step) {
          const i = (py * img.width + px) * 4;
          const a = data[i + 3];
          if (a <= 45) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const u = px / img.width - 0.5;
          const v = 0.5 - py / img.height;
          const z = (g / 255 - 0.5) * 0.42;

          tmpPos.push(u * imgAspect, v, z);
          tmpMeta.push(r / 255, b / 255, hashSeed(px, py));
          tmpAlpha.push(a / 255);
        }
      }

      const sampled: SampledPoints = {
        positions: new Float32Array(tmpPos),
        metas: new Float32Array(tmpMeta),
        alphas: new Float32Array(tmpAlpha),
        count: tmpAlpha.length,
        imgAspect,
      };
      pointsRef.current = sampled;

      if (gl && program) {
        posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sampled.positions, gl.STATIC_DRAW);

        metaBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, metaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sampled.metas, gl.STATIC_DRAW);

        alphaBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sampled.alphas, gl.STATIC_DRAW);
      }
    };

    let viewW = canvas.clientWidth || window.innerWidth;
    let viewH = canvas.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const syncSize = () => {
      if (!canvas) return;
      viewW = Math.max(1, canvas.clientWidth);
      viewH = Math.max(1, canvas.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(viewW * dpr);
      const targetH = Math.round(viewH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      if (gl) {
        gl.viewport(0, 0, targetW, targetH);
      }
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    const startTime = performance.now();

    const renderFrame = (now: number) => {
      if (disposed) return;
      const pts = pointsRef.current;
      const cam = cameraRef.current;
      const elapsedSec = (now - startTime) * 0.001;

      if (pts && cam.morph > 0.005 && cam.exitFade > 0.005) {
        const containerW = Math.min(viewW, 920);
        const coverW = Math.max(containerW, viewH * pts.imgAspect);
        const coverH = coverW / pts.imgAspect;
        const coverFactor = coverH / viewH;

        if (gl && program && posBuffer && metaBuffer && alphaBuffer) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

          gl.useProgram(program);

          gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
          if (attrs.aPos >= 0) {
            gl.enableVertexAttribArray(attrs.aPos);
            gl.vertexAttribPointer(attrs.aPos, 3, gl.FLOAT, false, 0, 0);
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, metaBuffer);
          if (attrs.aMeta >= 0) {
            gl.enableVertexAttribArray(attrs.aMeta);
            gl.vertexAttribPointer(attrs.aMeta, 3, gl.FLOAT, false, 0, 0);
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
          if (attrs.aAlpha >= 0) {
            gl.enableVertexAttribArray(attrs.aAlpha);
            gl.vertexAttribPointer(attrs.aAlpha, 1, gl.FLOAT, false, 0, 0);
          }

          gl.uniform1f(uniforms.uTime, elapsedSec);
          gl.uniform1f(uniforms.uMorph, cam.morph);
          gl.uniform1f(uniforms.uZoom, cam.zoom);
          gl.uniform1f(uniforms.uPanX, cam.panX);
          gl.uniform1f(uniforms.uPanY, cam.panY);
          gl.uniform1f(uniforms.uRotY, cam.rotY);
          gl.uniform1f(uniforms.uRotX, cam.rotX);
          gl.uniform1f(uniforms.uAspect, viewW / viewH);
          gl.uniform1f(uniforms.uCoverFactor, coverFactor);
          gl.uniform1f(uniforms.uDpr, dpr);
          gl.uniform1f(uniforms.uViewportH, viewH);
          gl.uniform2f(uniforms.uMouse, cam.mouseX, cam.mouseY);
          gl.uniform1f(uniforms.uSwirlPulse, cam.swirlPulse);
          gl.uniform1f(uniforms.uThemeMix, cam.themeMix);
          gl.uniform1f(uniforms.uDofStrength, cam.dofStrength);
          gl.uniform1f(uniforms.uFocusDepth, cam.focusDepth);
          gl.uniform1f(uniforms.uExitFade, cam.exitFade);

          gl.drawArrays(gl.POINTS, 0, pts.count);
        } else if (ctx2d) {
          const cw = canvas.width;
          const ch = canvas.height;
          ctx2d.clearRect(0, 0, cw, ch);

          const aspect = viewW / viewH;
          const projBase = 2.0 * coverFactor * cam.zoom;
          const cy = Math.cos(cam.rotY);
          const sy = Math.sin(cam.rotY);
          const cx = Math.cos(cam.rotX);
          const sx = Math.sin(cam.rotX);
          const dotSize = Math.max(1.5, Math.min(9 * dpr, 2.4 * cam.zoom * dpr));
          const darkT = cam.themeMix;

          for (let i = 0; i < pts.count; i++) {
            const p3 = i * 3;
            const px0 = pts.positions[p3];
            const py0 = pts.positions[p3 + 1];
            const pz0 = pts.positions[p3 + 2];
            const lum = pts.metas[p3];
            const acc = pts.metas[p3 + 1];

            const rx = px0 * cy + pz0 * sy;
            const rz1 = -px0 * sy + pz0 * cy;
            const ry = py0 * cx - rz1 * sx;
            const rz = py0 * sx + rz1 * cx;

            const persp = 3.0 / Math.max(0.6, 3.0 - rz);
            const ndcX = ((rx * projBase) / aspect) * persp + cam.panX;
            const ndcY = ry * projBase * persp + cam.panY;

            const sxScreen = (ndcX * 0.5 + 0.5) * cw;
            const syScreen = (0.5 - ndcY * 0.5) * ch;

            if (sxScreen < -dotSize || sxScreen > cw + dotSize) continue;
            if (syScreen < -dotSize || syScreen > ch + dotSize) continue;

            const alpha = cam.morph * cam.exitFade * pts.alphas[i] * (0.5 + 0.5 * lum);
            if (darkT < 0.5) {
              // Pristine Light Yellow + Gold-Amber Depth Contours
              const rC = Math.round(145 + lum * 109);
              const gC = Math.round(92 + lum * 142);
              const bC = Math.round(12 + lum * 116);
              ctx2d.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha.toFixed(2)})`;
            } else if (acc > 0.35) {
              ctx2d.fillStyle = `rgba(0, 240, 255, ${alpha.toFixed(2)})`;
            } else {
              const v = Math.round(125 + lum * 125);
              ctx2d.fillStyle = `rgba(${v}, ${v + 4}, 255, ${alpha.toFixed(2)})`;
            }
            ctx2d.fillRect(sxScreen, syScreen, dotSize, dotSize);
          }
        }
      } else if (gl) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      } else if (ctx2d) {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (gl) {
        if (posBuffer) gl.deleteBuffer(posBuffer);
        if (metaBuffer) gl.deleteBuffer(metaBuffer);
        if (alphaBuffer) gl.deleteBuffer(alphaBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [cameraRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Optical Depth-of-Field 3D Point-Cloud Portrait of Birky Pacuribot"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
