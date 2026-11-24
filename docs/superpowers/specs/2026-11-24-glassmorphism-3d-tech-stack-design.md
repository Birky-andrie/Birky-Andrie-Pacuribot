# 3D Glassmorphism Mechanical Tech Stack — Design Specification

**Date:** 2026-11-24  
**Project:** `D:\birky-portfolio` (Next.js 15, React 19, Tailwind CSS v4, TypeScript)  
**Target Section:** `#tech-stack` (inserted directly between `<Hero />` and `<WorkMatrix />`)

---

## 1. Intent & Why

Birky's portfolio currently moves directly from the 300vh 3D point-cloud Hero into `Recent Work` (`#work`), leaving his full hybrid toolset buried in case-study tags. Adding a signature interactive **3D Glassmorphism Mechanical Keyboard** right after the Hero gives recruiters and founders an immediate tactile proof moment—mirroring the memorable isometric keyboard choreography of [nareshkhatri.dev](https://nareshkhatri.dev/) while elevating the material craft (refractive glass keycaps), fluid entrance physics (velocity-driven motion blur), theme cohesion (Light `#F7F6F2` crystal quartz vs. Dark `#080A0F` smoked obsidian), and tactile acoustics (**ceramic brown switches**).

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Continuous Hero → Tech Stack → Work handoff:** Zero hard borders, boxes, or scroll seams. As the Hero point-cloud exits, the `#tech-stack` sticky stage takes over smoothly on the shared page surface (`#F7F6F2` Light / `#080A0F` Dark), then glides into `Recent Work`.
- **Dramatic right-to-center swing-in with velocity motion blur:** On scroll entry, the 3D keyboard whips in from off-right with sweeping yaw rotation, slight pitch/roll banking, scale-in, and dynamic directional motion blur proportional to live translational/angular speed—snapping razor-sharp as it settles centered.
- **Weightless centered float/bob idle loop:** Once centered, the board hovers in a slow dual-harmonic vertical bob (`sin` + subtle pitch/roll drift) plus restrained pointer parallax so it feels physically suspended in air.
- **Theme-adaptive glassmorphism keycaps & chassis:**
  - **Light Mode (`#F7F6F2`):** Frosted crystal quartz keycaps with subtle jewel-tinted translucency per pillar, crisp dark-etched vector legends, and a brushed pearl-silver anodized aluminum recessed key-well.
  - **Dark Mode (`#080A0F`):** Smoked obsidian sapphire glass keycaps on matte anodized gunmetal aluminum, subtle glowing under-switch LEDs per pillar (intensifying on press), and crisp luminous legends.
- **6×4 Full Hybrid Deck (24 keys):** Exact isometric proportions matching Naresh's 6×4 deck, spanning Birky's real verified stack: 12 Full-Stack/Systems + 6 AI/Cloud + 6 Creative Video & Remote Ops.
- **Diegetic angled label + direct proof copy:** Perspective-tilted label aligned along the keyboard's top-left edge (`Title` + 1 direct proof line tied to Birky's shipped work), swapping live on hover, tap/click, or real physical keyboard typing (`1–6`, `Q–Y`, `A–H`, `Z–N`).
- **Tactile Ceramic Brown Switch Web Audio:** Real-time synthesized press (tactile leaf bump + deep resonant ceramic bottom-out thock) and release (crisp lighter ceramic upstroke), unlocked on first user gesture, with a clean on-stage audio toggle pill.
- **Zero-breakage fallback:** `prefers-reduced-motion: reduce`, `saveData`, or unavailable WebGL cleanly renders a responsive 6×4 interactive glassmorphism keycap grid with the same ceramic audio and direct proof readout.

### Non-Goals
- No persistent floating keyboard across `Recent Work`, `Proof Stage`, or `Contact` (keyboard lives exclusively in `#tech-stack`).
- No multiplayer WebSocket press counter, Bongo Cat overlay, or playful meme copy.
- No heavy Spline embed, `@chibi3d/runtime`, `@react-three/fiber`, or external `.glb`/`.mp3` runtime fetches.

### Anti-Goals (Failure Conditions)
- **Opaque/muddy plastic caps:** Keycaps must visibly read as translucent frosted glass with crisp rim highlights, internal switch-stem silhouette, and legible legends in both Light and Dark themes.
- **Janky or stuck scroll transition:** Scroll scrubbing must never fight native wheel momentum, must work reliably in both scroll directions (down and back up), and must preserve `body { overflow-x: clip; }` so `position: sticky` never breaks.
- **Blocking Hero load:** Three.js must be dynamically imported (`next/dynamic`, `ssr: false`) and initialized via `IntersectionObserver` / idle mount so initial Hero FCP/LCP stays fast.
- **Harsh or robotic audio:** Switch sound must never clip, distort, or sound like a generic beep or harsh blue-switch click; it must carry a warm ceramic resonance + subtle brown tactile bump with natural per-press micro-variation.

---

## 3. Technical Approach (Locked)

### Considered Approaches
1. **Approach A — Custom Procedural Three.js (`three` only, lazy-loaded) + Physical Glass Shaders + Web Audio Ceramic Synth *(Selected)***
   - Installs only `three` + `@types/three`. Procedural beveled aluminum key-well + 24 concave-dish glass keycaps using `THREE.MeshPhysicalMaterial` + procedural PMREM studio softbox lighting + velocity-driven directional motion blur + synthesized Web Audio ceramic brown switches.
   - Chosen because it delivers true sculpted 3D glassmorphism, dynamic Light/Dark studio lighting, exact scroll-driven motion-blur swing choreography, React 19 clean compatibility, and zero external `.glb`/`.mp3` network dependencies.
2. **Approach B — Naresh's exact runtime (`@chibi3d/runtime` + `@react-three/fiber` + `gsap`) *(Rejected)***
   - ~450 KB+ dependency footprint, heavier React 19 peer coupling, and less direct control over dual-theme physical glass transmission and custom velocity motion-blur shaders.
3. **Approach C — Pure CSS 3D Isometric Glass Keycaps *(Rejected)***
   - Smallest bundle, but flat sharp-edged CSS boxes cannot reproduce sculpted concave keycap dishes, recessed beveled key-wells, or real 3D specular reflections during the sweeping right-to-center rotation.

---

## 4. Detailed Architecture & Design

### 4.1 Page Placement & Navigation
- Insert `<TechStackSection theme={theme} />` in `src/components/PortfolioShell.tsx` directly between `<Hero />` and `<WorkMatrix />`.
- Add `{ label: "Tech Stack", href: "#tech-stack" }` to `NAV_LINKS` in `src/components/Navbar.tsx` (first link, before `Work`) and add a jump action in `src/components/CommandPalette.tsx`.
- Section height: `h-[210vh]` sticky runway (`md:h-[220vh]`) on desktop when 3D is active (`min-h-screen` compact flow on reduced-motion/fallback) with a `sticky top-0 h-screen overflow-hidden` stage inside.
- Top and bottom `h-28` subtle gradient veils matching `var(--color-paper)` guarantee zero hard edges against Hero above and `Recent Work` below.

### 4.2 Scroll Choreography & Velocity Motion Blur *(Architect Call — Viewport-Entry Whip-In)*
To eliminate any dead/blank gap after Hero's exit and ensure clicking `#tech-stack` in the Navbar or Command Palette lands immediately on the centered interactive keyboard (not an invisible `opacity: 0` frame), drive the choreography from **viewport-entry-relative progress** (`rect = section.getBoundingClientRect()`, `vh = window.innerHeight`, `pinnedSpan = Math.max(1, rect.height - vh)`):

- **Entry progress** `entryRaw = clamp01((vh - rect.top) / vh)` — runs `0 → 1` as `#tech-stack` enters from the bottom of the viewport (`rect.top = vh`, right as Hero finishes fading out) up to sticky pin (`rect.top = 0`).
- **Hold/Exit progress** `holdRaw = clamp01(-rect.top / pinnedSpan)` — runs `0 → 1` while the sticky stage is pinned (`rect.top: 0 → -pinnedSpan`).
- **Unified damped progress** `rawP = entryRaw * 0.42 + holdRaw * 0.58` (`rawP ∈ [0, 1]`), smoothed each frame via frame-rate-independent exponential damping (`smoothP += (rawP - smoothP) * (1 - Math.exp(-dt * 9.5))`). Live whip speed `velocity = Math.abs(rawP - smoothP)` drives directional motion blur.

| Phase (`smoothP`) | Physical Scroll Position | Motion Choreography |
|---|---|---|
| `0.00 → 0.42` **Whip-In from Right** | `rect.top: vh → 0` (entering right as Hero dissolves) | Keyboard whips in from off-right (`posX: +8.8 → 0`, `posY: -0.65 → 0`), sweeps through an expressive isometric arc (`rotY: -1.65 rad → 0.14 rad`, `rotZ: -0.22 rad → 0`), and scales up (`0.72 → 1.0`). Opacity ramps `0 → 1` over `0.04 → 0.18`. **Directional Motion Blur** peaks during peak horizontal/rotational velocity (compositor-friendly horizontal directional blur + subtle velocity ghosting scaled by `velocity` and entry bell curve), snapping razor-sharp (`0px`) right as `rect.top` hits `0`. |
| `0.42 → 0.86` **Centered Float & Interactive Lock** | Sticky pinned (`#tech-stack` anchor lands right at `0.42`!) | Board rests dead-center (`posX: 0`, `scale: 1.0`). Continuous dual-harmonic floating/bobbing loop runs on the inner pivot (`y += sin(t * 1.55) * 0.14 + sin(t * 0.72) * 0.04`, gentle pitch `±0.022 rad`, roll `±0.018 rad`) blended with restrained pointer parallax (`±0.06 rad`). Diegetic top-left angled HUD fades in over `0.34 → 0.44`. All 24 keys respond to hover, click/tap, and physical keyboard typing. |
| `0.86 → 1.00` **Exit Glide into Recent Work** | Final ~15% of sticky runway before unstick | Board drifts gently upward (`posY: 0 → +1.5`), eases scale (`1.0 → 0.94`), and fades smoothly (`opacity: 1 → 0`) while the diegetic label fades out by `0.92`, handing off cleanly into `#work`. |

**Mobile (`< 768px`):** Adjust orthographic zoom/scale automatically from container aspect ratio so all 6 columns fit cleanly inside mobile viewport margins; support tap-to-press keys (tap depresses key, plays ceramic audio, and locks that skill's readout until another key is tapped).

### 4.3 3D Procedural Geometry & Theme-Adaptive Glassmorphism (`Three.js`)
- **Camera:** Orthographic isometric camera (`position: [-9.2, 9.8, 9.2]`, `lookAt: [0, 0.35, 0]`) matching Naresh's iconic balanced isometric perspective without perspective distortion across the 6×4 grid.
- **Studio Environment (`PMREMGenerator` + `RoomEnvironment`):** Procedural neutral softbox reflections so glass facets catch clean Apple-style specular rim strips without loading an external `.hdr` file.
- **Recessed Beveled Aluminum Chassis:**
  - Procedural rounded-rectangle outer shell with chamfered top rim and recessed dark inner switch plate (`6×4` key-well opening with clearance around keycap skirts).
  - Light Mode: brushed pearl-silver aluminum (`#E6E4DE`, metalness `0.38`, roughness `0.36`) with warm champagne-gray switch plate (`#CFCBC2`).
  - Dark Mode: anodized gunmetal aluminum (`#141720`, metalness `0.55`, roughness `0.42`) with deep obsidian switch plate (`#0A0C12`).
- **24 Sculpted Glassmorphism Keycaps:**
  - Each keycap is a layered assembly sharing instanced/reusable procedural geometry:
    1. **Outer Glass Cap Shell:** Tapered rounded-square keycap profile with beveled top edges and gentle spherical top dish (`MeshPhysicalMaterial`: high clearcoat `1.0`, `clearcoatRoughness: 0.08`, frosted `roughness: 0.16–0.22`, physical Fresnel `ior: 1.48`, translucent `opacity` / `transparent` + subtle pillar-tinted `color` & `attenuationColor` so the inner stem and plate glow visibly show through!).
    2. **Inner Frosted Switch Stem + Under-Key LED Halo:** Recessed translucent brown-tinted cross-stem core + soft radial LED emissive pad beneath each keycap. In Light Mode, subtle sunlit quartz refraction + soft pastel pillar tint; in Dark Mode, glowing per-key neon LED that surges (`emissiveIntensity: 0.28 → 1.35`) when pressed.
    3. **Top Legend Plane:** High-DPI (`256×256`) crisp vector-drawn canvas texture (sharp iconic monogram/glyph + micro-shortcut hint in corner) floating flush on the top glass face with theme-adaptive ink (deep charcoal `#14161D` in Light Mode, luminous `#F8FAFC` in Dark Mode).
- **Theme Transition:** When `theme` toggles between `"light"` and `"dark"`, smoothly lerp chassis, lighting intensities, keycap glass tint, under-key LED glow, and legend contrast over `~350ms` inside the render loop without remounting the WebGL context.
- **Physical Key Travel Physics:** On press, key depresses `-0.34` units with a crisp tactile-bump easing curve (`90ms` downstroke, `140ms` spring release) and slight under-key LED flare. Multi-input ref-counting (matching Naresh's `createKeyInput` pattern): a key stays depressed while held by hover, pointer press, or physical keyboard key, and releases cleanly on blur/visibility change.

### 4.4 6×4 Hybrid Tech Stack Roster (24 Keys)

| Row (Physical Keys) | Pillar & Glass Accent | Keys (`Label` — Direct 1-Line Proof) |
|---|---|---|
| **Row 1 (`1`–`6`)** | **Frontend & UI** (Cobalt `#4F6BFF`) | `TypeScript` (Strict types across Next.js UIs, Express APIs & Electron shells) · `JavaScript` (Core runtime powering WebGL shaders, Web Audio & interactive UI) · `React` (Component architecture behind HusAI, this site & live proof labs) · `Next.js` (App Router, static speed & 60fps interactive pages on Vercel) · `Tailwind` (Tokenized Light/Dark systems, crisp hairlines & fluid grids) · `Three.js` (Custom WebGL shaders, DoF point clouds & procedural 3D glass) |
| **Row 2 (`Q`–`Y`)** | **Backend & Systems** (Sapphire `#0EA5E9`) | `Node.js` (Real-time backend runtime driving HusAI & SIAM_CS3B servers) · `Express` (REST APIs, role-based auth & low-latency AI proxy routes) · `Python` (Workflow automation, Pacs Builders `<5s` audits & image pipelines) · `C++` (Systems programming, algorithms & parallel processing — BS CS) · `Flutter` (Single Dart codebase targeting 6 OS platforms — built Financify) · `Electron` (Native desktop shell wrapping HusAI's dual-channel call coach) |
| **Row 3 (`A`–`H`)** | **AI & Cloud** (Amber Gold `#EAB308`) | `Gemini` (Post-call review scoring, structured synthesis & multimodal AI) · `Groq` (Sub-second LLaMA 3.1 replies & Whisper voice VAD in HusAI) · `Claude` (AI-assisted architecture, rapid prototyping & technical workflows) · `Socket.IO` (Live bidirectional sync in SIAM_CS3B with QA traceability) · `GitHub` (Version control, PR rigor, CI/CD & open-source builds) · `Vercel` (Edge production deploys, Speed Insights & instant previews) |
| **Row 4 (`Z`–`N`)** | **Creative & Ops** (Violet `#A855F7`) | `CapCut Pro` (45+ beat-synced 9:16 paid social ads for Hackerlily DE/AU) · `Remotion` (Code-driven React motion graphics — HusAI's 60s launch reveal) · `Figma` (UI/UX wireframes, optical spacing grids & brand systems) · `Adobe` (Graphic assets, retouching & direct-response ad design) · `ClickUp` (Agile sprints, Trailblazer 1.00 SDLC delivery & executive VA ops) · `Meta / TikTok` (A/B hook testing, multi-platform SMM calendars & ad retention) |

### 4.5 Diegetic Angled HUD & Controls
- **Header:** Centered top eyebrow `02 // TECH STACK` + crisp micro-hint `Hover, tap, or type 1–6 · Q–Y · A–H · Z–N`.
- **Diegetic Angled Skill Label (Desktop):** Positioned cleanly along the upper-left diagonal beside the centered keyboard (matching Naresh's signature isometric perspective angle via subtle CSS 3D skew/tilt or synced screen-projected anchor) so it never overlaps any keycap. Displays:
  - Default resting state: `"Explore the stack"` + `"24 tools across Engineering, AI, Video & Ops."`
  - Active hovered/pressed state: Pillar pill (`FRONTEND · ROW 1`), large crisp skill title (`Next.js`), and the 1-line direct proof sentence, cross-fading smoothly with zero layout jump.
  - On narrow/mobile screens (`< 900px`): stacks cleanly centered above the board so zero text clips off-screen.
- **Audio & Pillar Controls (Bottom Bar):**
  - Compact frosted pill button: **`Ceramic Brown Audio: ON / MUTED`** (starts ON once unlocked by first click/key gesture; hovering/clicking a sound test button immediately unlocks Web Audio and plays a sample thock).
  - Subtle pillar legend dots (`Full-Stack` · `Systems` · `AI & Cloud` · `Creative & Ops`) that briefly highlight/ripple that row of keys when hovered or clicked.

### 4.6 Tactile Ceramic Brown Switch Audio Engine (`src/lib/ceramicSwitchAudio.ts`)
Pure Web Audio API procedural synthesis (zero network MP3 fetches, zero audio clipping):
- **Context lifecycle:** Lazy-created on first `pointerdown` or `keydown`; automatically resumed if `suspended`; muted cleanly if user toggles audio off or tab is hidden.
- **Downstroke (`playPress`):**
  1. **Tactile Brown Bump (`t = 0ms`, `10ms` decay):** Tight bandpass-filtered noise pulse (`1950 Hz`, `Q = 3.2`, gain `0.16`) simulating the brown tactile leaf bump before bottom-out.
  2. **Ceramic Stem Bottom-Out Thock (`t = 8ms`, `65ms` decay):** Warm ceramic cavity body oscillator sweeping `440 Hz → 260 Hz` (`sine` + subtle `triangle` harmonic at `880 Hz` damped in `28ms`) paired with a low-passed impact transient (`720 Hz`) — producing the unmistakable dense, smooth, glassy-warm **ceramic thock** instead of hollow plastic clack.
  3. **Organic micro-variance:** Every keystroke randomizes pitch by `±3.5%` and gain by `±8%` (and slightly shifts resonance by key row: deeper on Row 4, slightly crisper on Row 1).
- **Upstroke (`playRelease`):**
  - Shorter, lighter ceramic top-housing return (`t = 0ms`, `34ms` decay): `580 Hz → 410 Hz` damped ceramic ping (`gain 0.14`) + crisp `2600 Hz` bandpass micro-tick (`gain 0.09`).
- **Hover audio policy:** Hover depresses keycaps visually; **click/tap and physical `keydown` always play audio**, and hover plays a softer (`0.45×` volume, `55ms` cooldown) tactile tick once the browser AudioContext has been unlocked by any user gesture (preventing autoplay console errors).

### 4.7 Fallback & Performance Guardrails
- `prefers-reduced-motion: reduce` or WebGL context loss/failure renders `<TechStackFallbackGrid />`: a crisp 6×4 responsive glassmorphism button grid styled in the exact same Light/Dark frosted glass palette, supporting click + physical keyboard shortcuts + Ceramic Brown audio + proof readout.
- Pause Three.js `requestAnimationFrame` automatically whenever `#tech-stack` is scrolled completely off-screen (`IntersectionObserver`) or `document.hidden === true`, keeping GPU usage at `0%` while reading other sections.
- Cap `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` and dispose all geometries, materials, textures, and PMREM targets on unmount.

---

## 5. Planned File Footprint
- `package.json` — add `three` and `@types/three`
- `src/data/techStack.ts` — typed 24-key 6×4 hybrid roster, pillar tokens, vector icon drawing descriptors, and default physical key mappings
- `src/lib/ceramicSwitchAudio.ts` — procedural tactile ceramic brown switch Web Audio synthesizer (downstroke bump + ceramic thock + ceramic upstroke)
- `src/components/tech-stack/TechStackKeyboard3D.tsx` — client-only procedural Three.js glassmorphism 6×4 keyboard, studio PMREM lighting, dual-theme morph, scroll swing-in + velocity motion blur, floating idle physics, raycasting, and multi-input key press engine
- `src/components/tech-stack/TechStackFallbackGrid.tsx` — reduced-motion / no-WebGL glassmorphism 6×4 fallback grid
- `src/components/TechStackSection.tsx` — `#tech-stack` sticky runway wrapper, dynamic lazy import, diegetic angled HUD, audio toggle, pillar row ripple trigger, and top/bottom ambient blend veils
- `src/components/PortfolioShell.tsx`, `src/components/Navbar.tsx`, `src/components/CommandPalette.tsx` — wire `<TechStackSection theme={theme} />` right after `<Hero />` and add `#tech-stack` navigation

---

## 6. Left to the Builder
- Exact procedural geometry dimensions, bevel segment counts, and canvas vector glyph stroke details for crispness at 1x–2x DPR.
- Fine-tuning directional motion-blur strength (`px` / velocity multiplier) and PMREM softbox light positions via live browser visual inspection in both Light and Dark themes.
- Exact `z-index` layering so the sticky Navbar drawer and Command Palette always sit cleanly above `#tech-stack`.
