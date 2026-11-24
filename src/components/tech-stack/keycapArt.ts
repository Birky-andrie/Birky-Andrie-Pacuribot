import * as THREE from "three";
import type { TechStackKey } from "@/data/techStack";

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  key: TechStackKey,
  ink: string,
  accent: string,
  isDark: boolean
) {
  const cx = 128;
  const cy = 124;

  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (key.id) {
    case "react": {
      ctx.lineWidth = 7.5;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 56, 21, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      break;
    }

    case "nextjs": {
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 24);
      ctx.lineTo(cx - 20, cy - 24);
      ctx.lineTo(cx + 26, cy + 32);
      ctx.moveTo(cx + 20, cy - 24);
      ctx.lineTo(cx + 20, cy + 4);
      ctx.stroke();
      break;
    }

    case "tailwind": {
      ctx.lineWidth = 10;
      const drawWave = (yOff: number) => {
        ctx.beginPath();
        ctx.moveTo(cx - 46, cy + yOff + 6);
        ctx.bezierCurveTo(
          cx - 34,
          cy + yOff - 20,
          cx - 6,
          cy + yOff - 20,
          cx,
          cy + yOff
        );
        ctx.bezierCurveTo(
          cx + 6,
          cy + yOff + 20,
          cx + 34,
          cy + yOff + 20,
          cx + 46,
          cy + yOff - 6
        );
        ctx.stroke();
      };
      drawWave(-16);
      drawWave(16);
      break;
    }

    case "threejs": {
      ctx.lineWidth = 7.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 52);
      ctx.lineTo(cx + 48, cy + 36);
      ctx.lineTo(cx - 48, cy + 36);
      ctx.closePath();
      ctx.stroke();
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 8);
      ctx.lineTo(cx + 24, cy - 8);
      ctx.lineTo(cx, cy + 36);
      ctx.closePath();
      ctx.stroke();
      break;
    }

    case "nodejs": {
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 2;
        const x = cx + Math.cos(a) * 52;
        const y = cy + Math.sin(a) * 52;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.font = "700 42px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("JS", cx, cy + 3);
      break;
    }

    case "flutter": {
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx + 22, cy - 48);
      ctx.lineTo(cx - 32, cy + 6);
      ctx.lineTo(cx - 12, cy + 26);
      ctx.lineTo(cx + 34, cy - 20);
      ctx.moveTo(cx - 8, cy + 22);
      ctx.lineTo(cx + 24, cy + 50);
      ctx.stroke();
      break;
    }

    case "electron": {
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 52, 24, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 52, 24, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "gemini": {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 54);
      ctx.quadraticCurveTo(cx + 6, cy - 6, cx + 54, cy);
      ctx.quadraticCurveTo(cx + 6, cy + 6, cx, cy + 54);
      ctx.quadraticCurveTo(cx - 6, cy + 6, cx - 54, cy);
      ctx.quadraticCurveTo(cx - 6, cy - 6, cx, cy - 54);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "claude": {
      ctx.lineWidth = 8.5;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14);
        ctx.lineTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50);
        ctx.stroke();
      }
      break;
    }

    case "vercel": {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 48);
      ctx.lineTo(cx + 54, cy + 44);
      ctx.lineTo(cx - 54, cy + 44);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "github": {
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 36);
      ctx.lineTo(cx - 24, cy + 36);
      ctx.moveTo(cx - 24, cy + 8);
      ctx.bezierCurveTo(cx - 24, cy - 16, cx + 26, cy - 4, cx + 26, cy - 28);
      ctx.stroke();
      for (const [px, py] of [
        [cx - 24, cy - 36],
        [cx - 24, cy + 36],
        [cx + 26, cy - 28],
      ]) {
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#0C1018" : "#F7F6F2";
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case "socketio": {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - 32);
      ctx.lineTo(cx - 18, cy + 4);
      ctx.lineTo(cx + 4, cy + 4);
      ctx.lineTo(cx - 8, cy + 32);
      ctx.lineTo(cx + 18, cy - 4);
      ctx.lineTo(cx - 4, cy - 4);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "figma": {
      ctx.lineWidth = 7.5;
      const r = 18;
      const coords: [number, number][] = [
        [cx - r, cy - r * 2],
        [cx + r, cy - r * 2],
        [cx - r, cy],
        [cx + r, cy],
        [cx - r, cy + r * 2],
      ];
      for (const [px, py] of coords) {
        ctx.beginPath();
        ctx.arc(px, py, r - 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case "clickup": {
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy - 4);
      ctx.lineTo(cx, cy - 42);
      ctx.lineTo(cx + 38, cy - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 36, 0.22 * Math.PI, 0.78 * Math.PI);
      ctx.stroke();
      break;
    }

    case "capcut": {
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(cx - 42, cy - 34);
      ctx.lineTo(cx + 42, cy + 34);
      ctx.moveTo(cx - 42, cy + 34);
      ctx.lineTo(cx + 42, cy - 34);
      ctx.stroke();
      ctx.lineWidth = 6.5;
      ctx.strokeRect(cx - 48, cy - 38, 62, 76);
      break;
    }

    case "remotion": {
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy - 42);
      ctx.lineTo(cx + 40, cy);
      ctx.lineTo(cx - 28, cy + 42);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 20);
      ctx.lineTo(cx + 18, cy);
      ctx.lineTo(cx - 12, cy + 20);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
      break;
    }

    default: {
      // Crisp geometric monogram (TS, JS, ex, Py, C++, GQ, Ad, SMM)
      const len = key.shortMark.length;
      const fontSize = len >= 3 ? 64 : 84;
      ctx.font = `700 ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(key.shortMark, cx, cy + 4);
      break;
    }
  }

  ctx.restore();
}

/**
 * Generates high-DPI transparent canvas texture for a glass keycap's top face.
 */
export function createKeycapLegendTexture(
  key: TechStackKey,
  mode: "light" | "dark"
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    const isDark = mode === "dark";
    const ink = isDark ? "rgba(248, 250, 252, 0.96)" : "rgba(20, 22, 29, 0.92)";
    const subInk = isDark
      ? "rgba(226, 232, 240, 0.45)"
      : "rgba(22, 23, 27, 0.36)";

    // Apple Liquid Glass prismatic frosted rim hairline framing the concave key dish
    const rimGrad = ctx.createLinearGradient(18, 18, 238, 238);
    if (isDark) {
      rimGrad.addColorStop(0, "rgba(186, 230, 253, 0.52)");
      rimGrad.addColorStop(0.32, "rgba(255, 255, 255, 0.34)");
      rimGrad.addColorStop(0.68, "rgba(240, 171, 252, 0.34)");
      rimGrad.addColorStop(1, "rgba(253, 224, 71, 0.24)");
    } else {
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      rimGrad.addColorStop(0.38, "rgba(186, 230, 253, 0.62)");
      rimGrad.addColorStop(0.72, "rgba(240, 171, 252, 0.48)");
      rimGrad.addColorStop(1, "rgba(253, 224, 71, 0.42)");
    }
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(16, 16, 224, 224, 36);
    ctx.stroke();

    // Subtle top-left specular sheen crescent inside the clear glass dish
    const sheenGrad = ctx.createLinearGradient(20, 20, 150, 150);
    sheenGrad.addColorStop(0, isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.18)");
    sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.roundRect(18, 18, 220, 220, 34);
    ctx.fill();

    // Main vector icon / monogram
    drawGlyph(ctx, key, ink, key.accentHex, isDark);

    // Subtle micro shortcut legend in top-left corner (matching custom mechanical keycaps)
    ctx.fillStyle = subInk;
    ctx.font = "600 22px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(key.shortcutChar, 32, 28);

    // Tiny pillar accent indicator dot bottom-right
    ctx.fillStyle = key.accentHex;
    ctx.globalAlpha = isDark ? 0.92 : 0.78;
    ctx.beginPath();
    ctx.arc(212, 212, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
