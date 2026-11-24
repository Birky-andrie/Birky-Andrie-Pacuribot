export interface KeyboardPose {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  boardOpacity: number;
  hudOpacity: number;
  blurPx: number;
  ghostOffsetPx: number;
  ghostOpacity: number;
  bobY: number;
  bobPitch: number;
  bobRoll: number;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Quintic ease-out for dramatic right-to-center whip deceleration.
 */
function easeOutQuint(t: number): number {
  const inv = 1 - clamp01(t);
  return 1 - inv * inv * inv * inv * inv;
}

/**
 * Viewport-entry-relative progress:
 * - entryRaw runs 0 -> 1 as #tech-stack enters from bottom of viewport (rectTop: vh -> 0).
 * - holdRaw runs 0 -> 1 while the sticky stage is pinned (rectTop: 0 -> -(rectHeight - vh)).
 * Unified rawP = entryRaw * 0.42 + holdRaw * 0.58 so clicking #tech-stack lands immediately at 0.42 (centered & sharp).
 */
export function computeTechStackScrollProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number
): number {
  const vh = Math.max(1, viewportHeight);
  const pinnedSpan = Math.max(1, rectHeight - vh);
  const entryRaw = clamp01((vh - rectTop) / vh);
  const holdRaw = clamp01(-rectTop / pinnedSpan);
  return clamp01(entryRaw * 0.42 + holdRaw * 0.58);
}

/**
 * Evaluates full 3D board transform, dual-harmonic floating/bobbing,
 * HUD visibility, and velocity-driven directional motion blur.
 */
export function evaluateKeyboardPose(
  smoothP: number,
  velocity: number,
  timeSec: number
): KeyboardPose {
  const p = clamp01(smoothP);

  // Phase 1: 0.00 -> 0.42 whip-in from off-right to dead-center
  const entryLinear = clamp01(p / 0.42);
  const entryEase = easeOutQuint(entryLinear);

  // Subtle overshoot settle right as board arrives at center (0.28 -> 0.48)
  const settleWave =
    Math.sin(clamp01((p - 0.28) / 0.2) * Math.PI) * (1 - smoothstep(0.4, 0.52, p)) * 0.045;

  // Phase 3: 0.86 -> 1.00 smooth upward exit glide into Recent Work
  const exitEase = smoothstep(0.86, 1.0, p);

  // Isometric camera sits at [-9.2, 9.8, 9.2] looking at origin.
  // Screen-right in world coordinates points along (+0.707, 0, +0.707).
  const rightTravel = lerp(9.4, 0, entryEase) - settleWave * 4.5;
  const posX = rightTravel * 0.7071;
  const posZ = rightTravel * 0.7071;
  const posY = lerp(-0.75, 0, entryEase) + lerp(0, 1.65, exitEase);

  // Expressive sweeping yaw + dynamic roll banking that locks cleanly into isometric rest
  const rotY = lerp(-1.68, 0.14, entryEase) + settleWave * 0.45 + lerp(0, 0.22, exitEase);
  const rotX = lerp(0.28, 0.0, entryEase) + lerp(0, -0.14, exitEase);
  const rotZ = lerp(-0.24, 0.0, entryEase) * (1 - entryEase * 0.35);

  const scale = lerp(0.7, 1.0, entryEase) * lerp(1.0, 0.92, exitEase);

  // Board fades in quickly on entry (0.03 -> 0.16) and out smoothly at bottom (0.87 -> 0.99)
  const entryAlpha = smoothstep(0.03, 0.16, p);
  const exitAlpha = 1 - smoothstep(0.87, 0.99, p);
  const boardOpacity = clamp01(entryAlpha * exitAlpha);

  // Diegetic angled HUD appears right as keyboard locks center and exits cleanly before unstick
  const hudIn = smoothstep(0.32, 0.43, p);
  const hudOut = 1 - smoothstep(0.84, 0.93, p);
  const hudOpacity = clamp01(hudIn * hudOut);

  // Continuous dual-harmonic floating/bobbing once settled (and gently present throughout)
  const floatWeight = smoothstep(0.2, 0.44, p) * (1 - exitEase * 0.7);
  const bobY =
    (Math.sin(timeSec * 1.55) * 0.145 + Math.sin(timeSec * 0.74 + 1.1) * 0.045) * floatWeight;
  const bobPitch = Math.sin(timeSec * 1.12 + 0.5) * 0.022 * floatWeight;
  const bobRoll = Math.cos(timeSec * 0.88) * 0.018 * floatWeight;

  // Velocity-driven directional motion blur:
  // Peaks during whip-in sweep (entryBell) or rapid scroll velocity, guaranteed 0px when settled & idle.
  const entryBell = Math.sin(entryLinear * Math.PI);
  const whipIntensity = clamp01(velocity * 19.5) * (0.35 + entryBell * 1.15);
  const settledDamp = 1 - smoothstep(0.39, 0.46, p) * (1 - smoothstep(0.84, 0.94, p));
  const blurEnergy = clamp01(whipIntensity * (0.28 + settledDamp * 0.95));

  const blurPx = blurEnergy > 0.015 ? Math.min(7.5, blurEnergy * 7.2) : 0;
  const ghostOffsetPx = blurEnergy > 0.02 ? Math.min(28, blurEnergy * 28) : 0;
  const ghostOpacity = blurEnergy > 0.02 ? Math.min(0.28, blurEnergy * 0.28) : 0;

  return {
    posX,
    posY,
    posZ,
    rotX,
    rotY,
    rotZ,
    scale,
    boardOpacity,
    hudOpacity,
    blurPx,
    ghostOffsetPx,
    ghostOpacity,
    bobY,
    bobPitch,
    bobRoll,
  };
}
