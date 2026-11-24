"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

export interface PointCloudCameraState {
  assembly: number; // 0 -> 1 opening swirl assembly on load
  zoom: number; // 1.0 -> 2.65
  panX: number; // NDC X offset
  panY: number; // NDC Y offset
  rotY: number; // Y-axis 3D rotation
  rotX: number; // X-axis 3D tilt
  mouseX: number; // normalized pointer X (-1..1)
  mouseY: number; // normalized pointer Y (-1..1)
  swirlPulse: number; // 0..1 organic turbulence during camera sweeps
  motionBlur: number; // 0..1 velocity-driven cinematic motion blur
  themeMix: number; // 0 = Light Mode (Sunlit Amber-Gold), 1 = Dark Mode (Dark Neon)
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
  floats: Float32Array;
  count: number;
  imgAspect: number;
}

const VERTEX_SHADER_SRC = `
  attribute vec3 aPos;
  attribute vec3 aMeta;
  attribute float aAlpha;
  attribute float aFloat;

  uniform float uTime;
  uniform float uAssembly;
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
  varying float vFloat;

  void main() {
    float lum = aMeta.x;
    float accent = aMeta.y;
    float seed = aMeta.z;

    vec3 p = aPos;

    // 1. Opening 1.35s 3D spiral assembly + smooth exit scatter
    float assembleScatter = (1.0 - uAssembly);
    float exitDisp = (1.0 - uExitFade) * 0.46;
    float scatterAmp = assembleScatter * 0.72 + uSwirlPulse * 0.065 + exitDisp;

    float phase = seed * 6.2831853 + uTime * 1.15;
    float waveX = sin(p.y * 8.0 + phase) * cos(p.x * 5.6 - uTime * 0.8);
    float waveY = cos(p.x * 7.1 + phase * 0.85) * 0.75;
    float waveZ = sin((p.x + p.y) * 9.0 + uTime * 1.05);

    // Spiral inward angle during opening assembly
    float spiralAngle = assembleScatter * (1.45 + seed * 1.35);
    float sc = cos(spiralAngle);
    float ss = sin(spiralAngle);
    vec2 spun = vec2(p.x * sc - p.z * ss, p.x * ss + p.z * sc);
    p.x = mix(p.x, spun.x, assembleScatter * 0.85);
    p.z = mix(p.z, spun.y, assembleScatter * 0.85);

    p.x += waveX * (0.0018 + scatterAmp * (0.36 + seed * 0.55));
    p.y += waveY * (0.0018 + scatterAmp * (0.30 + seed * 0.48)) + exitDisp * (0.20 + seed * 0.26);
    p.z += waveZ * (0.003 + scatterAmp * 0.52) + assembleScatter * (seed - 0.5) * 0.85;

    // 2. Ambient floating halo micro-pixels peeling gently off the silhouette in 3D space
    if (aFloat > 0.01) {
      float driftT = uTime * (0.38 + seed * 0.45) + seed * 19.3;
      float radialDir = sign(p.x + 0.001);
      float lift = mod(uTime * (0.055 + seed * 0.065) + seed, 1.0);
      float driftEnvelope = sin(lift * 3.14159265);
      p.x += (radialDir * (0.04 + lift * 0.24) + sin(driftT) * 0.065) * aFloat;
      p.y += (lift * 0.26 - 0.04 + cos(driftT * 0.85) * 0.035) * aFloat;
      p.z += (sin(driftT * 1.15) * 0.34 + (seed - 0.45) * 0.38) * aFloat;
      vFloat = aFloat * driftEnvelope;
    } else {
      vFloat = 0.0;
    }

    // 3. 3D Rotation around Y then X
    float cy = cos(uRotY);
    float sy = sin(uRotY);
    vec3 rY = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);

    float cx = cos(uRotX);
    float sx = sin(uRotX);
    vec3 rYX = vec3(rY.x, rY.y * cx - rY.z * sx, rY.y * sx + rY.z * cx);

    // 4. Tactile pointer repulsion swirl
    float projBase = 2.0 * uCoverFactor * uZoom;
    vec2 preNdc = vec2((rYX.x * projBase) / uAspect + uPanX, rYX.y * projBase + uPanY);
    vec2 mouseVec = preNdc - uMouse;
    mouseVec.x *= uAspect;
    float mDist = length(mouseVec);
    float repulse = smoothstep(0.30, 0.0, mDist) * (0.016 / max(uZoom, 0.75)) * (0.35 + 0.65 * uAssembly);
    if (mDist > 0.0001) {
      vec2 dir = normalize(mouseVec);
      rYX.x += dir.x * repulse * 0.65 + waveX * repulse * 0.35;
      rYX.y += dir.y * repulse * 0.65 + waveY * repulse * 0.35;
      rYX.z += repulse * 1.45;
    }

    // 5. Optical Z-Depth-of-Field Circle of Confusion (deepens during assembly & macro face zoom)
    float effectiveDof = clamp(uDofStrength + assembleScatter * 0.72, 0.0, 1.15);
    float coc = clamp(abs(rYX.z - uFocusDepth) * 4.2 * effectiveDof, 0.0, 1.0);
    vCoc = coc;

    float camDist = 3.0;
    float persp = camDist / max(0.55, camDist - rYX.z * (0.68 + 0.34 * min(uZoom, 2.5)));

    vec2 ndc = vec2(
      ((rYX.x * projBase) / uAspect) * persp + uPanX,
      (rYX.y * projBase) * persp + uPanY
    );

    gl_Position = vec4(ndc, clamp(-rYX.z * 0.45, -0.95, 0.95), 1.0);

    // Smaller, crisper micro-pixels calibrated for 340x382 density (like motionsites.ai reference)
    float gridPx = (uViewportH * uCoverFactor / 382.0) * uZoom * uDpr;
    float lumScale = 0.66 + 0.28 * lum + 0.14 * accent;
    float floatScale = mix(1.0, 0.85 + seed * 0.65, aFloat);
    float dofScale = 1.0 + coc * 2.25;
    gl_PointSize = clamp(gridPx * 0.86 * lumScale * floatScale * persp * dofScale, 1.15 * uDpr, 15.0 * uDpr);

    vLum = lum;
    vAccent = accent;
    float floatAlphaFactor = aFloat > 0.01 ? (0.35 + 0.65 * vFloat) : 1.0;
    vAlpha = aAlpha * smoothstep(0.0, 0.22, uAssembly) * uExitFade * floatAlphaFactor;
    vDepth = clamp(rYX.z + 0.5, 0.0, 1.0);
    vEdgeGlow = clamp(repulse * 18.0 + uSwirlPulse * 0.45 + aFloat * 0.55, 0.0, 1.0);
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
  varying float vFloat;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float boxDist = max(abs(coord.x), abs(coord.y));
    float circleDist = length(coord);

    // Crisp micro-square pixels on the focal plane -> soft optical circular bokeh orbs out of focus
    float dist = mix(boxDist, circleDist, clamp(vCoc * 1.1 + vFloat * 0.35, 0.0, 1.0));
    if (dist > 0.48) discard;

    float sharpness = mix(0.38, 0.08, vCoc);
    float shapeMask = 1.0 - smoothstep(sharpness, 0.48, dist);
    float bokehAtten = 1.0 - vCoc * 0.58;

    // 1) LIGHT MODE PALETTE: Sculptural Sunlit Gold -> Burnished Amber -> Espresso-Bronze Relief
    vec3 sunlitGold = vec3(0.953, 0.749, 0.133);      // #F3BF22 Rich Sunlit Gold Highlight
    vec3 vividRimGold = vec3(0.980, 0.800, 0.082);    // #FACC15 Golden Floating Rim Shimmer
    vec3 burnishedAmber = vec3(0.796, 0.494, 0.047);  // #CB7E0C Sculptural Midtone Amber
    vec3 bronzeUmber = vec3(0.518, 0.278, 0.055);     // #84470E Bronze Contour Shading
    vec3 espressoCore = vec3(0.243, 0.129, 0.039);    // #3E210A Crisp Eyes, Hair & Facial Relief

    float darkness = 1.0 - vLum;
    vec3 lightShade = mix(sunlitGold, burnishedAmber, smoothstep(0.08, 0.46, darkness));
    lightShade = mix(lightShade, bronzeUmber, smoothstep(0.38, 0.74, darkness) * 0.92);
    lightShade = mix(lightShade, espressoCore, smoothstep(0.68, 0.96, darkness) * 0.86);
    lightShade = mix(lightShade, vividRimGold, clamp(vAccent * 0.48 + vEdgeGlow * 0.40, 0.0, 0.72));

    // 2) DARK MODE PALETTE: Dark Neon (Ice-White + Neon Cyan #00F0FF + Electric Indigo #455CE9 + Violet)
    vec3 iceWhite = vec3(0.95, 0.98, 1.0);
    vec3 neonCyan = vec3(0.0, 0.94, 1.0);
    vec3 electricIndigo = vec3(0.271, 0.361, 0.914);
    vec3 neonViolet = vec3(0.486, 0.227, 0.929);

    vec3 darkBase = iceWhite * (0.48 + 0.65 * vLum);
    vec3 neonRim = mix(electricIndigo, mix(neonCyan, neonViolet, 0.35 + 0.35 * sin(vDepth * 3.14)), clamp(vDepth, 0.0, 1.0));
    vec3 darkCol = mix(darkBase, neonRim, clamp(vAccent * 0.90 + vEdgeGlow * 0.55, 0.0, 0.96));
    darkCol += neonCyan * (vDepth * 0.09);

    vec3 finalCol = mix(lightShade, darkCol, uThemeMix);

    float lightAlpha = vAlpha * shapeMask * bokehAtten * (0.80 + 0.20 * darkness);
    float darkAlpha = vAlpha * shapeMask * bokehAtten * (0.48 + 0.52 * vLum);
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
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<SampledPoints | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let disposed = false;
    let rafId = 0;
    let isVisible = true;

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
    let floatBuffer: WebGLBuffer | null = null;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    let attrs = { aPos: -1, aMeta: -1, aAlpha: -1, aFloat: -1 };

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
              aFloat: gl.getAttribLocation(program, "aFloat"),
            };
            const names = [
              "uTime",
              "uAssembly",
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
      const tmpFloat: number[] = [];
      const edgeCandidates: [number, number, number, number, number][] = [];
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
          const z = (g / 255 - 0.5) * 0.46;
          const seed = hashSeed(px, py);

          tmpPos.push(u * imgAspect, v, z);
          tmpMeta.push(r / 255, b / 255, seed);
          tmpAlpha.push(a / 255);
          tmpFloat.push(0);

          // Collect contour/rim pixels to spawn ambient floating halo specks
          if (b > 55 || (a > 50 && a < 230)) {
            edgeCandidates.push([u * imgAspect, v, z, r / 255, b / 255]);
          }
        }
      }

      // Spawn ~2,200 dedicated ambient floating micro-pixels around silhouette contours
      const haloTarget = gl && program ? 2200 : 320;
      if (edgeCandidates.length > 0) {
        const stride = Math.max(1, Math.floor(edgeCandidates.length / haloTarget));
        let added = 0;
        for (let idx = 0; idx < edgeCandidates.length && added < haloTarget; idx += stride) {
          const [ex, ey, ez, elum, eacc] = edgeCandidates[idx];
          const seed = hashSeed(idx * 1.73, added * 3.17);
          tmpPos.push(ex, ey, ez);
          tmpMeta.push(Math.min(1, elum + 0.18), Math.min(1, eacc + 0.35), seed);
          tmpAlpha.push(0.75);
          tmpFloat.push(0.55 + seed * 0.65);
          added++;
        }
      }

      const sampled: SampledPoints = {
        positions: new Float32Array(tmpPos),
        metas: new Float32Array(tmpMeta),
        alphas: new Float32Array(tmpAlpha),
        floats: new Float32Array(tmpFloat),
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

        floatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sampled.floats, gl.STATIC_DRAW);
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

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = Boolean(entries[0]?.isIntersecting);
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    io.observe(wrap);

    const startTime = performance.now();

    const renderFrame = (now: number) => {
      if (disposed) return;

      if (!isVisible || document.hidden) {
        rafId = requestAnimationFrame(renderFrame);
        return;
      }

      const pts = pointsRef.current;
      const cam = cameraRef.current;
      const elapsedSec = (now - startTime) * 0.001;

      // Apply silky velocity-driven motion blur on wrapper during rapid scroll sweeps
      const blurPx = cam.motionBlur > 0.02 ? Math.min(4.8, cam.motionBlur * 4.8) : 0;
      if (blurPx > 0.06) {
        const stretch = 1 + blurPx * 0.0065;
        wrap.style.filter = `blur(${blurPx.toFixed(2)}px)`;
        wrap.style.transform = `scale(${stretch.toFixed(4)})`;
      } else {
        if (wrap.style.filter !== "") wrap.style.filter = "";
        if (wrap.style.transform !== "") wrap.style.transform = "";
      }

      if (pts && cam.exitFade > 0.005) {
        // Balanced heroic framing: keeps full head headroom while sitting cleanly above the bottom marquee
        const containerW = Math.min(viewW, 960);
        const maxH = Math.min(viewH * 0.96, 1040);
        const fitH = Math.min(maxH, containerW / pts.imgAspect);
        const coverFactor = fitH / viewH;
        const bottomAnchorNdc =
          (0.055 - (1.0 - coverFactor) * 0.3) * Math.max(0, 1.0 - (cam.zoom - 1.0) * 1.4);
        const effectivePanY = cam.panY + bottomAnchorNdc;

        if (gl && program && posBuffer && metaBuffer && alphaBuffer && floatBuffer) {
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

          gl.bindBuffer(gl.ARRAY_BUFFER, floatBuffer);
          if (attrs.aFloat >= 0) {
            gl.enableVertexAttribArray(attrs.aFloat);
            gl.vertexAttribPointer(attrs.aFloat, 1, gl.FLOAT, false, 0, 0);
          }

          gl.uniform1f(uniforms.uTime, elapsedSec);
          gl.uniform1f(uniforms.uAssembly, cam.assembly);
          gl.uniform1f(uniforms.uZoom, cam.zoom);
          gl.uniform1f(uniforms.uPanX, cam.panX);
          gl.uniform1f(uniforms.uPanY, effectivePanY);
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
          const dotSize = Math.max(1.2, Math.min(7 * dpr, 1.85 * cam.zoom * dpr));
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
            const ndcY = ry * projBase * persp + effectivePanY;

            const sxScreen = (ndcX * 0.5 + 0.5) * cw;
            const syScreen = (0.5 - ndcY * 0.5) * ch;

            if (sxScreen < -dotSize || sxScreen > cw + dotSize) continue;
            if (syScreen < -dotSize || syScreen > ch + dotSize) continue;

            const alpha =
              cam.assembly * cam.exitFade * pts.alphas[i] * (0.68 + 0.32 * (1 - lum));
            if (darkT < 0.5) {
              const rC = Math.round(62 + lum * 181);
              const gC = Math.round(33 + lum * 158);
              const bC = Math.round(10 + lum * 26);
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
      io.disconnect();
      if (gl) {
        if (posBuffer) gl.deleteBuffer(posBuffer);
        if (metaBuffer) gl.deleteBuffer(metaBuffer);
        if (alphaBuffer) gl.deleteBuffer(alphaBuffer);
        if (floatBuffer) gl.deleteBuffer(floatBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [cameraRef]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 h-full w-full will-change-[transform,filter]"
    >
      <canvas
        ref={canvasRef}
        aria-label="Optical Depth-of-Field 3D Micro-Pixel Silhouette of Birky Pacuribot"
        className="h-full w-full"
      />
    </div>
  );
}
