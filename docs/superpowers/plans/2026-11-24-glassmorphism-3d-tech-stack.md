# 3D Glassmorphism Mechanical Tech Stack Implementation Plan

> **For agentic workers:** Native execution in this session (`executing-plans` discipline). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `#tech-stack` section directly after `<Hero />` featuring a procedural Three.js 6×4 isometric glassmorphism mechanical keyboard that whips in from the right with velocity-driven directional motion blur, locks center-stage in a continuous floating/bobbing loop, adapts dynamically between Light quartz and Dark smoked obsidian themes, and plays synthesized tactile ceramic brown switch audio on hover, click, or physical typing.

**Architecture:** Install only `three` + `@types/three` (lazy-loaded client-side via `next/dynamic`). Decompose cleanly into typed stack data (`src/data/techStack.ts`), procedural Web Audio ceramic brown switch synth (`src/lib/ceramicSwitchAudio.ts`), multi-input & pure scroll-choreography helpers (`src/components/tech-stack/keyboardInput.ts`, `src/components/tech-stack/keyboardChoreography.ts`), procedural Three.js glassmorphism scene (`src/components/tech-stack/TechStackKeyboard3D.tsx`), reduced-motion/no-WebGL fallback (`src/components/tech-stack/TechStackFallbackGrid.tsx`), and the `#tech-stack` sticky stage wrapper (`src/components/TechStackSection.tsx`) wired into `PortfolioShell`, `Navbar`, and `CommandPalette`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.8, Tailwind CSS v4, Three.js (`MeshPhysicalMaterial`, `PMREMGenerator`, `RoomEnvironment`), Web Audio API.

**Spec:** `D:\birky-portfolio\docs\superpowers\specs\2026-11-24-glassmorphism-3d-tech-stack-design.md`

## Global Constraints
- Zero heavy runtime bloat: install only `three` and `@types/three`; lazy-load 3D scene via `next/dynamic({ ssr: false })`.
- Dual-theme surfaces must match existing portfolio tokens (`#F7F6F2` Light / `#080A0F` Dark) with zero hard seams against `<Hero />` above and `<WorkMatrix />` below.
- Preserve `body { overflow-x: clip; }` so `position: sticky` inside Hero and Tech Stack never breaks.
- Respect `prefers-reduced-motion: reduce`, `navigator.connection?.saveData`, and WebGL failure with `<TechStackFallbackGrid />`.
- Pause WebGL `requestAnimationFrame` when off-screen or tab-hidden (`document.hidden`); cap DPR at `Math.min(window.devicePixelRatio, 2)`.
- Strictly typed TypeScript (`npx tsc --noEmit` must exit `0`) and clean production build (`npm run build` must exit `0`).

## Review Focus
1. **Viewport-entry whip-in vs. `#tech-stack` anchor landing:** Jumping directly to `#tech-stack` via Navbar or `⌘K` puts `rect.top === 0`, which must compute `entryRaw = 1`, `smoothP ≈ 0.42`, landing immediately on the centered, sharp, floating keyboard rather than an invisible `opacity: 0` off-right state.
2. **AudioContext autoplay blocking & memory leaks:** Hovering before any click/keypress must never throw Web Audio autoplay errors; every generated oscillator/noise buffer node must disconnect cleanly `onended`.
3. **Physical keyboard conflict with typing inputs & `⌘K` palette:** Pressing `1–6 / Q–Y / A–H / Z–N` while typing inside the Contact form, Command Palette search input, or holding Ctrl/Meta/Alt must be ignored (`isTypingTarget`), and physical key presses must only trigger when `#tech-stack` is visible in the viewport.
4. **Theme toggle without WebGL remount:** Switching Light ↔ Dark must smoothly morph chassis metal, glass keycap color/opacity, under-key LED emissive, lighting, and top-face legend textures without destroying/recreating the WebGLRenderer.
5. **Fast scroll reverse & mobile tap ergonomics:** Scrolling rapidly back up into Hero or down into Recent Work must cleanly clamp `smoothP ∈ [0, 1]` and decay motion blur to `0px`; tapping a key on touch devices must trigger press+release audio and keep the active skill readout visible until another key is tapped.

---

### Task 1: Dependencies, Typed 6×4 Stack Data & Pure Choreography/Input Modules

**Files:**
- Modify: `D:\birky-portfolio\package.json` (install `three`, `@types/three`)
- Create: `D:\birky-portfolio\src\data\techStack.ts`
- Create: `D:\birky-portfolio\src\components\tech-stack\keyboardChoreography.ts`
- Create: `D:\birky-portfolio\src\components\tech-stack\keyboardInput.ts`

**Interfaces:**
- Produces `TECH_STACK_KEYS: TechStackKey[]` (length `24`, 6 cols × 4 rows), `TECH_PILLARS`, `TechStackKey`, `TechPillarId`
- Produces `computeTechStackScrollProgress(rectTop: number, rectHeight: number, viewportHeight: number): number` and `evaluateKeyboardPose(smoothP: number, velocity: number, timeSec: number): KeyboardPose`
- Produces `createKeyInputController(keys: readonly TechStackKey[])` and `isTypingTarget(target: EventTarget | null): boolean`

- [ ] **Step 1:** Install `three` and `@types/three` in `D:\birky-portfolio`.
- [ ] **Step 2:** Create `src/data/techStack.ts` with all 24 verified tools, pillar metadata (Cobalt `#4F6BFF`, Sapphire `#0EA5E9`, Amber Gold `#EAB308`, Violet `#A855F7`), short glyph tokens, direct 1-line proofs, and physical `KeyboardEvent.code` shortcuts (`Digit1`–`Digit6`, `KeyQ`–`KeyY`, `KeyA`–`KeyH`, `KeyZ`–`KeyN`).
- [ ] **Step 3:** Create `src/components/tech-stack/keyboardChoreography.ts` implementing viewport-entry progress (`entryRaw * 0.42 + holdRaw * 0.58`), damped velocity motion-blur curve (`blurPx`, `ghostOffsetPx`, `ghostOpacity`), right-to-center isometric whip arc (`posX: +8.8 → 0`, `rotY: -1.65 → 0.14`, `rotZ: -0.22 → 0`), dual-harmonic float/bob idle loop, and exit glide (`0.86 → 1.0`).
- [ ] **Step 4:** Create `src/components/tech-stack/keyboardInput.ts` with ref-counted multi-input state (`hover`, `pointer:<id>`, `key:<code>`, `ripple`) and `isTypingTarget` guard.
- [ ] **Step 5:** Verify `npx tsc --noEmit` passes cleanly.

---

### Task 2: Tactile Ceramic Brown Switch Web Audio Synthesizer

**Files:**
- Create: `D:\birky-portfolio\src\lib\ceramicSwitchAudio.ts`

**Interfaces:**
- Produces `createCeramicSwitchAudio()` returning `{ unlock(): void; setMuted(muted: boolean): void; isMuted(): boolean; isUnlocked(): boolean; playPress(row?: number, soft?: boolean): void; playRelease(row?: number, soft?: boolean): void; dispose(): void }`

- [ ] **Step 1:** Implement `src/lib/ceramicSwitchAudio.ts` using pure Web Audio API:
  - Lazy `AudioContext` creation & gesture unlock (`pointerdown`/`keydown`).
  - `playPress`: pre-travel brown tactile leaf bump (`1950 Hz` bandpass noise, `10ms`) + warm ceramic bottom-out resonance (`440 → 260 Hz` sine + `880 Hz` damped harmonic + `720 Hz` impact transient, `65ms` decay), row-weighted pitch + `±3.5%` organic variance.
  - `playRelease`: crisp ceramic upstroke (`580 → 410 Hz` damped ping + `2600 Hz` micro-tick, `34ms` decay).
  - Hover cooldown (`55ms`) and clean node disconnection `onended`.

---

### Task 3: Procedural 3D Glassmorphism Keyboard Engine (`TechStackKeyboard3D.tsx`)

**Files:**
- Create: `D:\birky-portfolio\src\components\tech-stack\keycapArt.ts` (procedural 256×256 crisp vector legend textures for Light & Dark themes for all 24 tools)
- Create: `D:\birky-portfolio\src\components\tech-stack\TechStackKeyboard3D.tsx`

**Interfaces:**
- Consumes `TECH_STACK_KEYS`, `computeTechStackScrollProgress`, `evaluateKeyboardPose`, `createKeyInputController`, `createCeramicSwitchAudio`, `ThemeMode`
- Produces default export `TechStackKeyboard3D` accepting `{ theme: ThemeMode; sectionRef: RefObject<HTMLElement | null>; muted: boolean; rippleRow: number | null; onActiveKeyChange: (key: TechStackKey | null) => void; onAudioUnlock: () => void; onWebGLUnavailable: () => void }`

- [ ] **Step 1:** Create `src/components/tech-stack/keycapArt.ts` rendering sharp, recognizable vector iconography/monograms + subtle corner key-shortcut markers onto high-DPI offscreen canvases for both Light ink (`#14161D`) and Dark ink (`#F8FAFC`).
- [ ] **Step 2:** Build `TechStackKeyboard3D.tsx`:
  - Orthographic isometric Three.js scene with `PMREMGenerator` + `RoomEnvironment` softbox studio reflections, directional key/rim/fill lights, and responsive frustum fitting desktop & mobile.
  - Procedural beveled rounded-rectangle aluminum chassis with recessed switch plate (`ExtrudeGeometry` with clean bevels) + 24 sculpted concave-top beveled glassmorphism keycaps (`MeshPhysicalMaterial` with clearcoat, Fresnel specular, frosted translucency, visible internal brown tactile stem, and under-key LED glow plane).
  - Smooth 350ms theme interpolation between Light quartz/pearl-silver aluminum and Dark smoked obsidian/gunmetal + glowing under-key LEDs (zero WebGL remount).
  - Frame-rate-independent scroll whip-in, velocity-driven directional motion blur (applied smoothly to the canvas wrapper + subtle horizontal shutter trail layer so zero extra WebGL render-target overhead occurs and blur hits razor-sharp `0px` at center), continuous dual-harmonic bob/float + pointer parallax, raycasted hover/press, physical keyboard shortcuts (gated to when `#tech-stack` is on screen), row ripple animation, and full GPU disposal on unmount.

---

### Task 4: Reduced-Motion Fallback Grid, `#tech-stack` Stage Wrapper & App Wiring

**Files:**
- Create: `D:\birky-portfolio\src\components\tech-stack\TechStackFallbackGrid.tsx`
- Create: `D:\birky-portfolio\src\components\TechStackSection.tsx`
- Modify: `D:\birky-portfolio\src\components\PortfolioShell.tsx`
- Modify: `D:\birky-portfolio\src\components\Navbar.tsx`
- Modify: `D:\birky-portfolio\src\components\CommandPalette.tsx`

- [ ] **Step 1:** Create `TechStackFallbackGrid.tsx` — responsive 6×4 frosted glass keycap button grid matching Light/Dark themes with Ceramic Brown audio and active proof readout.
- [ ] **Step 2:** Create `TechStackSection.tsx` — `h-[210vh] md:h-[220vh]` sticky runway with top/bottom `var(--color-paper)` ambient gradient veils, dynamic lazy import of `TechStackKeyboard3D`, centered header (`02 // TECH STACK`), diegetic top-left angled skill proof label (`transform: rotate(-11deg) skewX(-6deg)` desktop, clean centered stack mobile), bottom frosted Ceramic Brown Audio toggle pill + interactive pillar ripple chips.
- [ ] **Step 3:** Wire `<TechStackSection theme={theme} />` in `PortfolioShell.tsx` directly between `<Hero />` and `<WorkMatrix />`, and add `#tech-stack` links in `Navbar.tsx` and `CommandPalette.tsx`.

---

### Task 5: Live Browser Verification, Polish, Production Build & Push

- [ ] **Step 1:** Run `npx tsc --noEmit` to verify zero TypeScript errors.
- [ ] **Step 2:** Verify live on `http://localhost:3000/` via `browser` subagent:
  - Scroll from Hero bottom into `#tech-stack` and verify zero seam, right-to-center whip-in with motion blur, centered floating 6×4 glassmorphism keyboard in Light Mode, hover/click keycap depression + angled proof label update, and Dark Mode smoked glass + under-key LEDs.
  - Test clicking `#tech-stack` in Navbar lands immediately on centered keyboard (not blank).
  - Verify zero console errors and zero HTTP 4xx/5xx.
- [ ] **Step 3:** Inspect screenshots via `read_file` and fix any visual/alignment/contrast polish issues.
- [ ] **Step 4:** Stop dev server, run `npm run build` to verify clean production bundle, commit and push to `origin/main`, and restart clean `next dev` daemon.
