"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  KEYBOARD_COLS,
  KEYBOARD_ROWS,
  TECH_STACK_KEYS,
  type TechStackKey,
} from "@/data/techStack";
import type { ThemeMode } from "../ThemeToggle";
import {
  clamp01,
  computeTechStackScrollProgress,
  evaluateKeyboardPose,
  lerp,
} from "./keyboardChoreography";
import { createKeyInputController, isTypingTarget } from "./keyboardInput";
import { createKeycapLegendTexture } from "./keycapArt";
import type { CeramicSwitchAudio } from "@/lib/ceramicSwitchAudio";

export interface TechStackKeyboard3DProps {
  theme: ThemeMode;
  sectionRef: RefObject<HTMLElement | null>;
  audioRef: RefObject<CeramicSwitchAudio | null>;
  rippleTrigger: { row: number; nonce: number } | null;
  onActiveKeyChange: (key: TechStackKey | null) => void;
  onHudOpacityChange: (opacity: number) => void;
  onAudioUnlock: () => void;
  onWebGLUnavailable: () => void;
}

const KEY_PITCH = 1.07;
const KEY_TRAVEL = 0.31;

function createRoundedRectShape(
  halfW: number,
  halfD: number,
  radius: number
): THREE.Shape {
  const s = new THREE.Shape();
  const r = Math.min(radius, halfW * 0.9, halfD * 0.9);
  s.moveTo(-halfW + r, -halfD);
  s.lineTo(halfW - r, -halfD);
  s.quadraticCurveTo(halfW, -halfD, halfW, -halfD + r);
  s.lineTo(halfW, halfD - r);
  s.quadraticCurveTo(halfW, halfD, halfW - r, halfD);
  s.lineTo(-halfW + r, halfD);
  s.quadraticCurveTo(-halfW, halfD, -halfW, halfD - r);
  s.lineTo(-halfW, -halfD + r);
  s.quadraticCurveTo(-halfW, -halfD, -halfW + r, -halfD);
  return s;
}

function createRoundedRectPath(
  halfW: number,
  halfD: number,
  radius: number
): THREE.Path {
  const p = new THREE.Path();
  const r = Math.min(radius, halfW * 0.9, halfD * 0.9);
  p.moveTo(-halfW + r, -halfD);
  p.lineTo(halfW - r, -halfD);
  p.quadraticCurveTo(halfW, -halfD, halfW, -halfD + r);
  p.lineTo(halfW, halfD - r);
  p.quadraticCurveTo(halfW, halfD, halfW - r, halfD);
  p.lineTo(-halfW + r, halfD);
  p.quadraticCurveTo(-halfW, halfD, -halfW, halfD - r);
  p.lineTo(-halfW, -halfD + r);
  p.quadraticCurveTo(-halfW, -halfD, -halfW + r, -halfD);
  return p;
}

/**
 * Builds a lofted, tapered SA/ceramic-style sculpted mechanical keycap with
 * smooth beveled shoulders and a subtle concave finger dish on the top face.
 */
function createSculptedKeycapGeometry(): THREE.BufferGeometry {
  const cornerSegs = 6;
  const ringCount = (cornerSegs + 1) * 4;

  const sampleContour = (halfSize: number, radius: number, y: number) => {
    const pts: [number, number, number][] = [];
    const r = Math.min(radius, halfSize * 0.92);
    for (let c = 0; c < 4; c++) {
      const startAngle = (c * Math.PI) / 2;
      const cx = (c === 0 || c === 3 ? 1 : -1) * (halfSize - r);
      const cz = (c < 2 ? 1 : -1) * (halfSize - r);
      for (let s = 0; s <= cornerSegs; s++) {
        const theta = startAngle + (s / cornerSegs) * (Math.PI / 2);
        pts.push([cx + Math.cos(theta) * r, y, cz + Math.sin(theta) * r]);
      }
    }
    return pts;
  };

  // Sculpted ceramic keycap vertical profile (base skirt -> tapered walls -> soft shoulder -> concave dish)
  const rings = [
    sampleContour(0.475, 0.135, 0.0),
    sampleContour(0.472, 0.135, 0.08),
    sampleContour(0.445, 0.13, 0.34),
    sampleContour(0.415, 0.125, 0.56),
    sampleContour(0.398, 0.12, 0.625),
    sampleContour(0.368, 0.112, 0.662),
    sampleContour(0.315, 0.095, 0.654),
    sampleContour(0.18, 0.055, 0.642),
  ];

  const positions: number[] = [];
  const indices: number[] = [];

  for (const ring of rings) {
    for (const [x, y, z] of ring) {
      positions.push(x, y, z);
    }
  }

  // Center vertex of the subtle concave top dish
  const topCenterIdx = positions.length / 3;
  positions.push(0, 0.634, 0);

  for (let r = 0; r < rings.length - 1; r++) {
    const rowA = r * ringCount;
    const rowB = (r + 1) * ringCount;
    for (let i = 0; i < ringCount; i++) {
      const next = (i + 1) % ringCount;
      // Verified outward CCW winding: (+Y) x (+Z) = (+X) outward normal
      indices.push(rowA + i, rowB + next, rowA + next);
      indices.push(rowA + i, rowB + i, rowB + next);
    }
  }

  // Close top dish fan with verified upward (+Y) normal: (-X) x (+Z) = (+Y)
  const lastRow = (rings.length - 1) * ringCount;
  for (let i = 0; i < ringCount; i++) {
    const next = (i + 1) % ringCount;
    indices.push(lastRow + i, topCenterIdx, lastRow + next);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates a soft radial ambient shadow disc texture for the floating board.
 */
function createFloatingShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
    grad.addColorStop(0, "rgba(10, 14, 24, 0.42)");
    grad.addColorStop(0.45, "rgba(10, 14, 24, 0.18)");
    grad.addColorStop(0.78, "rgba(10, 14, 24, 0.05)");
    grad.addColorStop(1, "rgba(10, 14, 24, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function TechStackKeyboard3D({
  theme,
  sectionRef,
  audioRef,
  rippleTrigger,
  onActiveKeyChange,
  onHudOpacityChange,
  onAudioUnlock,
  onWebGLUnavailable,
}: TechStackKeyboard3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blurLayerRef = useRef<HTMLDivElement | null>(null);
  const targetThemeRef = useRef(theme === "dark" ? 1 : 0);

  const callbacksRef = useRef({
    onActiveKeyChange,
    onHudOpacityChange,
    onAudioUnlock,
    onWebGLUnavailable,
  });
  callbacksRef.current = {
    onActiveKeyChange,
    onHudOpacityChange,
    onAudioUnlock,
    onWebGLUnavailable,
  };

  const rippleFnRef = useRef<((row: number) => void) | null>(null);

  useEffect(() => {
    targetThemeRef.current = theme === "dark" ? 1 : 0;
  }, [theme]);

  useEffect(() => {
    if (rippleTrigger !== null) {
      rippleFnRef.current?.(rippleTrigger.row);
    }
  }, [rippleTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    const blurLayer = blurLayerRef.current;
    if (!container || !blurLayer) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      callbacksRef.current.onWebGLUnavailable();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    blurLayer.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Procedural Studio Softbox Environment (zero external HDR fetch)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.045);
    scene.environment = envTarget.texture;
    roomEnv.dispose();

    // Orthographic isometric camera (matches Naresh's signature distortion-free projection)
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60);
    camera.position.set(-9.2, 9.8, 9.2);
    camera.lookAt(0, 0.28, 0);

    // Dual-theme studio lighting rig tuned for Apple Liquid Glass specular & prism glints
    const hemiLight = new THREE.HemisphereLight("#FFFFFF", "#DDD7CC", 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#FFFBF2", 2.25);
    keyLight.position.set(-6.5, 11.8, -2.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 28;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Prism-catching cool cyan/indigo rim light across beveled keycap shoulders
    const rimLight = new THREE.DirectionalLight("#7DD3FC", 1.35);
    rimLight.position.set(7.8, 6.2, 7.2);
    scene.add(rimLight);

    // Subtle iridescent warm-violet opposite catchlight for Liquid Glass chromatic sheen
    const prismAccentLight = new THREE.DirectionalLight("#F0ABFC", 0.72);
    prismAccentLight.position.set(-5.2, 4.4, 8.6);
    scene.add(prismAccentLight);

    const underFillLight = new THREE.DirectionalLight("#E2E8F0", 0.55);
    underFillLight.position.set(2.5, -4, -6);
    scene.add(underFillLight);

    // Hierarchy: worldGroup (scroll swing-in) -> floatPivot (bobbing & cursor parallax)
    const worldGroup = new THREE.Group();
    const floatPivot = new THREE.Group();
    worldGroup.add(floatPivot);
    scene.add(worldGroup);

    // Soft floating shadow disc beneath board (stays anchored slightly lower)
    const shadowTex = createFloatingShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const shadowGeo = new THREE.PlaneGeometry(9.6, 7.2);
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0.2, -1.08, 0.2);
    worldGroup.add(shadowMesh);

    // Dimensions for 6x4 recessed aluminum chassis
    const keysW = (KEYBOARD_COLS - 1) * KEY_PITCH + 1.0;
    const keysD = (KEYBOARD_ROWS - 1) * KEY_PITCH + 1.0;
    const wellHalfW = keysW / 2 + 0.14;
    const wellHalfD = keysD / 2 + 0.14;
    const outerHalfW = wellHalfW + 0.46;
    const outerHalfD = wellHalfD + 0.46;

    // 1. Machined recessed upper aluminum frame (ExtrudeGeometry with key-well cutout)
    const frameShape = createRoundedRectShape(outerHalfW, outerHalfD, 0.44);
    frameShape.holes.push(createRoundedRectPath(wellHalfW, wellHalfD, 0.18));
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.075,
      bevelSegments: 5,
      curveSegments: 16,
    });
    frameGeo.rotateX(Math.PI / 2);
    frameGeo.translate(0, 0.72, 0);

    // 2. Solid beveled aluminum base tray beneath frame
    const baseShape = createRoundedRectShape(outerHalfW - 0.03, outerHalfD - 0.03, 0.42);
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 4,
      curveSegments: 16,
    });
    baseGeo.rotateX(Math.PI / 2);
    baseGeo.translate(0, 0.35, 0);

    const caseMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#E7E5DF"),
      metalness: 0.36,
      roughness: 0.34,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.2,
    });

    const frameMesh = new THREE.Mesh(frameGeo, caseMat);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    floatPivot.add(frameMesh);

    const baseMesh = new THREE.Mesh(baseGeo, caseMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    floatPivot.add(baseMesh);

    // 3. Recessed brushed switch plate inside key-well
    const plateShape = createRoundedRectShape(wellHalfW + 0.04, wellHalfD + 0.04, 0.16);
    const plateGeo = new THREE.ShapeGeometry(plateShape, 12);
    plateGeo.rotateX(-Math.PI / 2);
    const plateMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D2CEC5"),
      metalness: 0.45,
      roughness: 0.56,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = 0.42;
    plateMesh.receiveShadow = true;
    floatPivot.add(plateMesh);

    // 4. Subtle front-left frosted accent trim strip on bezel
    const stripGeo = new THREE.BoxGeometry(outerHalfW * 0.92, 0.045, 0.045);
    const stripMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#EAB308"),
      emissive: new THREE.Color("#EAB308"),
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.2,
    });
    const stripMesh = new THREE.Mesh(stripGeo, stripMat);
    stripMesh.position.set(-outerHalfW * 0.34, 0.38, outerHalfD + 0.068);
    floatPivot.add(stripMesh);

    // Shared keycap geometries
    const capGeo = createSculptedKeycapGeometry();
    // Caramel-brown mechanical tactile switch housing + MX cross-stem clearly visible through crystal glass
    const switchHousingGeo = new THREE.BoxGeometry(0.46, 0.24, 0.46);
    const stemBarXGeo = new THREE.BoxGeometry(0.24, 0.14, 0.068);
    const stemBarZGeo = new THREE.BoxGeometry(0.068, 0.14, 0.24);
    // Opaque glowing under-key diffuser puck so Three.js physical transmission
    // genuinely refracts & prism-disperses each app's brand color through the glass keycap
    const ledGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.055, 20);
    const legendGeo = new THREE.PlaneGeometry(0.66, 0.66);

    // Warm caramel-brown mechanical tactile switch materials (Render 1 look)
    const switchBaseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#A96B3D"),
      roughness: 0.36,
      metalness: 0.12,
    });
    const brownStemMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#7C4722"),
      roughness: 0.34,
      metalness: 0.14,
    });

    interface KeyRuntime {
      key: TechStackKey;
      index: number;
      motionGroup: THREE.Group;
      capMesh: THREE.Mesh;
      capMat: THREE.MeshPhysicalMaterial;
      ledMat: THREE.MeshStandardMaterial;
      legendMat: THREE.MeshBasicMaterial;
      lightTex: THREE.CanvasTexture;
      darkTex: THREE.CanvasTexture;
      lightColor: THREE.Color;
      darkColor: THREE.Color;
      lightAtten: THREE.Color;
      darkAtten: THREE.Color;
      accentColor: THREE.Color;
      pressTarget: number;
      pressCurrent: number;
      pressVelocity: number;
      glowCurrent: number;
    }

    const keyRuntimes: KeyRuntime[] = [];
    const hitMeshes: THREE.Mesh[] = [];
    const keyByMesh = new Map<THREE.Object3D, TechStackKey>();

    TECH_STACK_KEYS.forEach((key, index) => {
      const slotX = (key.col - (KEYBOARD_COLS - 1) / 2) * KEY_PITCH;
      const slotZ = (key.row - (KEYBOARD_ROWS - 1) / 2) * KEY_PITCH;

      const slotGroup = new THREE.Group();
      slotGroup.position.set(slotX, 0.43, slotZ);
      floatPivot.add(slotGroup);

      // Caramel-brown mechanical switch housing + MX cross-stem clearly visible inside glass
      const housingMesh = new THREE.Mesh(switchHousingGeo, switchBaseMat);
      housingMesh.position.y = 0.14;
      slotGroup.add(housingMesh);

      const stemX = new THREE.Mesh(stemBarXGeo, brownStemMat);
      stemX.position.y = 0.3;
      slotGroup.add(stemX);

      const stemZ = new THREE.Mesh(stemBarZGeo, brownStemMat);
      stemZ.position.y = 0.3;
      slotGroup.add(stemZ);

      const accentColor = new THREE.Color(key.accentHex);
      const ledMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FFFFFF").lerp(accentColor, 0.45),
        emissive: accentColor.clone(),
        emissiveIntensity: 0.48,
        roughness: 0.32,
        metalness: 0.05,
      });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.y = 0.032;
      slotGroup.add(ledMesh);

      // Moving keycap group (depresses downward on press)
      const motionGroup = new THREE.Group();
      motionGroup.position.y = 0.12;
      slotGroup.add(motionGroup);

      // Render 1 target: ultra-clear 15%-frosted optical crystal + exact 20% app brand color tint
      const lightColor = new THREE.Color("#FFFFFF").lerp(accentColor, 0.2);
      const darkColor = new THREE.Color("#182030").lerp(accentColor, 0.24);
      const lightAtten = new THREE.Color("#FFFFFF").lerp(accentColor, 0.24);
      const darkAtten = new THREE.Color("#E2F2FF").lerp(accentColor, 0.48);

      const capMat = new THREE.MeshPhysicalMaterial({
        color: lightColor.clone(),
        emissive: accentColor.clone(),
        emissiveIntensity: 0.02,
        // Crystal-clear see-through optical glass + 15% fine satin frost + prism rainbow caustics
        transmission: 0.9,
        thickness: 1.6,
        ior: 1.52,
        dispersion: 6.2,
        // Iridescent prism color bending across sculpted rounded shoulders & skirts
        iridescence: 1.0,
        iridescenceIOR: 1.32,
        iridescenceThicknessRange: [230, 660],
        // 15% frosted satin glass surface + wet optical clearcoat glaze
        roughness: 0.15,
        metalness: 0.01,
        clearcoat: 1.0,
        clearcoatRoughness: 0.035,
        sheen: 0.2,
        sheenRoughness: 0.18,
        sheenColor: new THREE.Color("#FFFFFF"),
        attenuationColor: lightAtten.clone(),
        attenuationDistance: 2.2,
        reflectivity: 1.0,
        envMapIntensity: 2.2,
      });

      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.castShadow = true;
      capMesh.receiveShadow = true;
      capMesh.userData.keyId = key.id;
      motionGroup.add(capMesh);

      // Crisp top vector legend plane (dual pre-rendered textures for zero-lag theme swap)
      const lightTex = createKeycapLegendTexture(key, "light");
      const darkTex = createKeycapLegendTexture(key, "dark");
      const legendMat = new THREE.MeshBasicMaterial({
        map: targetThemeRef.current > 0.5 ? darkTex : lightTex,
        transparent: true,
        opacity: 0.96,
        depthWrite: false,
      });
      const legendMesh = new THREE.Mesh(legendGeo, legendMat);
      legendMesh.rotation.x = -Math.PI / 2;
      legendMesh.position.y = 0.658;
      motionGroup.add(legendMesh);

      hitMeshes.push(capMesh);
      keyByMesh.set(capMesh, key);

      keyRuntimes.push({
        key,
        index,
        motionGroup,
        capMesh,
        capMat,
        ledMat,
        legendMat,
        lightTex,
        darkTex,
        lightColor,
        darkColor,
        lightAtten,
        darkAtten,
        accentColor,
        pressTarget: 0,
        pressCurrent: 0,
        pressVelocity: 0,
        glowCurrent: 0,
      });
    });

    // Center keyboard geometry cleanly around pivot
    floatPivot.position.set(0, -0.42, 0);

    // Multi-input controller (hover, click/tap, physical keyboard, pillar ripple)
    const input = createKeyInputController(TECH_STACK_KEYS);
    const runtimeById = new Map(keyRuntimes.map((r) => [r.key.id, r]));
    let lastTouchKeyId: string | null = null;

    const unsubscribeInput = input.subscribe((key, pressed, source) => {
      const rt = runtimeById.get(key.id);
      if (rt) {
        rt.pressTarget = pressed ? 1 : 0;
      }

      const isHover = source === "hover";
      const isRipple = source.startsWith("ripple:");
      if (pressed) {
        if (!isHover && !isRipple) {
          audioRef.current?.unlock();
          callbacksRef.current.onAudioUnlock();
        }
        audioRef.current?.playPress(key.row, isHover || isRipple);
      } else {
        audioRef.current?.playRelease(key.row, isHover || isRipple);
      }

      const active = input.getLatestActive();
      if (active) {
        callbacksRef.current.onActiveKeyChange(active);
      } else if (!lastTouchKeyId) {
        callbacksRef.current.onActiveKeyChange(null);
      }
    });

    // Pillar row wave ripple helper
    const rippleTimers: number[] = [];
    rippleFnRef.current = (row: number) => {
      const rowKeys = TECH_STACK_KEYS.filter((k) => k.row === row);
      audioRef.current?.unlock();
      callbacksRef.current.onAudioUnlock();
      rowKeys.forEach((k, idx) => {
        const src = `ripple:${k.id}`;
        const t1 = window.setTimeout(() => {
          input.press(src, k.id);
        }, idx * 55);
        const t2 = window.setTimeout(() => {
          input.release(src, k.id);
        }, idx * 55 + 210);
        rippleTimers.push(t1, t2);
      });
    };

    // Raycasting & pointer interaction
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(99, 99);
    const parallaxTarget = { x: 0, y: 0 };
    const parallaxCurrent = { x: 0, y: 0 };
    let hoveredKeyId: string | null = null;
    let isSectionVisible = false;

    const pickKeyAtEvent = (e: PointerEvent): TechStackKey | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length === 0) return null;
      return keyByMesh.get(hits[0].object) ?? null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        parallaxTarget.x = Math.max(-1, Math.min(1, nx));
        parallaxTarget.y = Math.max(-1, Math.min(1, ny));
      }

      if (e.pointerType !== "mouse") return;
      const hit = pickKeyAtEvent(e);
      if (hit) {
        renderer.domElement.style.cursor = "pointer";
        if (hoveredKeyId !== hit.id) {
          hoveredKeyId = hit.id;
          lastTouchKeyId = null;
          input.press("hover", hit.id);
        }
      } else {
        renderer.domElement.style.cursor = "default";
        if (hoveredKeyId) {
          input.release("hover", hoveredKeyId);
          hoveredKeyId = null;
        }
      }
    };

    const onPointerLeave = () => {
      parallaxTarget.x = 0;
      parallaxTarget.y = 0;
      renderer.domElement.style.cursor = "default";
      if (hoveredKeyId) {
        input.release("hover", hoveredKeyId);
        hoveredKeyId = null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      audioRef.current?.unlock();
      callbacksRef.current.onAudioUnlock();
      const hit = pickKeyAtEvent(e);
      if (!hit) return;
      if (e.pointerType !== "mouse") {
        lastTouchKeyId = hit.id;
        callbacksRef.current.onActiveKeyChange(hit);
      }
      input.press(`pointer:${e.pointerId}`, hit.id);
    };

    const onPointerUp = (e: PointerEvent) => {
      input.release(`pointer:${e.pointerId}`);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        !isSectionVisible ||
        e.defaultPrevented ||
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        isTypingTarget(e.target)
      ) {
        return;
      }
      const key = input.shortcuts.get(e.code);
      if (!key) return;
      lastTouchKeyId = null;
      input.press(`key:${e.code}`, key.id);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      input.release(`key:${e.code}`);
    };

    const onBlur = () => input.releaseAll();

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    // Responsive orthographic frustum sizing
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const aspect = w / Math.max(1, h);
      const isCompact = w < 768;
      // Fit full 6x4 isometric width cleanly across desktop & mobile viewports
      const halfHeight = isCompact ? 5.9 / Math.min(1, aspect * 1.12) : 4.25;
      const halfWidth = halfHeight * aspect;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Theme color endpoints (cached once for zero-alloc per-frame lerping)
    const cCaseLight = new THREE.Color("#ECEAE4");
    const cCaseDark = new THREE.Color("#141822");
    const cPlateLight = new THREE.Color("#E5E2DA");
    const cPlateDark = new THREE.Color("#090B11");
    const cStripLight = new THREE.Color("#D9A520");
    const cStripDark = new THREE.Color("#38BDF8");
    const cKeyLightWarm = new THREE.Color("#FFF9EE");
    const cKeyLightCool = new THREE.Color("#E0F2FE");
    const cRimLightDay = new THREE.Color("#FDE68A");
    const cRimLightDark = new THREE.Color("#6366F1");
    const cHemiSkyLight = new THREE.Color("#FFFFFF");
    const cHemiSkyDark = new THREE.Color("#94A3B8");
    const cHemiGndLight = new THREE.Color("#DDD8CE");
    const cHemiGndDark = new THREE.Color("#0F172A");

    let currentThemeMix = targetThemeRef.current;
    let legendMode: "light" | "dark" = currentThemeMix > 0.5 ? "dark" : "light";

    // Scroll progress & damping state
    const getRawScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return 0.42;
      const rect = sec.getBoundingClientRect();
      return computeTechStackScrollProgress(rect.top, rect.height, window.innerHeight);
    };

    let smoothP = getRawScroll();
    let lastHudSent = -1;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsedSec = 0;
    let running = false;

    const startLoop = () => {
      if (running || document.hidden) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsedSec += dt;

      // 1. Exponentially damped scroll choreography + velocity
      const rawP = getRawScroll();
      const damp = 1 - Math.exp(-dt * 9.5);
      const prevSmooth = smoothP;
      smoothP += (rawP - smoothP) * damp;
      const velocity = Math.abs(rawP - prevSmooth);

      const pose = evaluateKeyboardPose(smoothP, velocity, elapsedSec);

      // 2. Smooth pointer parallax
      const pDamp = 1 - Math.exp(-dt * 6.5);
      parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * pDamp;
      parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * pDamp;

      // Apply scroll whip-in transform to worldGroup
      worldGroup.position.set(pose.posX, pose.posY, pose.posZ);
      worldGroup.rotation.set(pose.rotX, pose.rotY, pose.rotZ);
      worldGroup.scale.setScalar(pose.scale);

      // Apply continuous dual-harmonic float/bob & pointer tilt to floatPivot
      floatPivot.position.y = -0.42 + pose.bobY;
      floatPivot.rotation.set(
        pose.bobPitch + parallaxCurrent.y * 0.055,
        parallaxCurrent.x * 0.065,
        pose.bobRoll - parallaxCurrent.x * 0.03
      );

      // Shadow breathes inversely with float bob
      const shadowScale = 1 - pose.bobY * 0.35;
      shadowMesh.scale.set(shadowScale, shadowScale, 1);
      shadowMat.opacity =
        lerp(0.36, 0.56, currentThemeMix) *
        pose.boardOpacity *
        (1 - pose.bobY * 0.65);

      // 3. Apply velocity-driven directional motion blur + opacity on wrapper
      if (pose.blurPx > 0.05) {
        const stretchX = 1 + pose.blurPx * 0.009;
        const shiftX = pose.ghostOffsetPx * 0.38;
        blurLayer.style.filter = `blur(${pose.blurPx.toFixed(2)}px)`;
        blurLayer.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0) scaleX(${stretchX.toFixed(4)})`;
      } else {
        if (blurLayer.style.filter !== "") blurLayer.style.filter = "";
        if (blurLayer.style.transform !== "") blurLayer.style.transform = "";
      }
      blurLayer.style.opacity = pose.boardOpacity.toFixed(3);

      // Update HUD opacity only when meaningfully changed
      if (Math.abs(pose.hudOpacity - lastHudSent) > 0.015) {
        lastHudSent = pose.hudOpacity;
        callbacksRef.current.onHudOpacityChange(pose.hudOpacity);
      }

      // 4. Smooth Light <-> Dark theme interpolation (~350ms)
      const themeTarget = targetThemeRef.current;
      const themeStep = 1 - Math.exp(-dt * 10);
      currentThemeMix += (themeTarget - currentThemeMix) * themeStep;

      caseMat.color.copy(cCaseLight).lerp(cCaseDark, currentThemeMix);
      caseMat.metalness = lerp(0.72, 0.62, currentThemeMix);
      caseMat.roughness = lerp(0.24, 0.36, currentThemeMix);
      caseMat.envMapIntensity = lerp(1.45, 1.0, currentThemeMix);

      plateMat.color.copy(cPlateLight).lerp(cPlateDark, currentThemeMix);
      stripMat.color.copy(cStripLight).lerp(cStripDark, currentThemeMix);
      stripMat.emissive.copy(cStripLight).lerp(cStripDark, currentThemeMix);
      stripMat.emissiveIntensity = lerp(0.22, 1.15, currentThemeMix);

      keyLight.color.copy(cKeyLightWarm).lerp(cKeyLightCool, currentThemeMix);
      keyLight.intensity = lerp(2.25, 1.65, currentThemeMix);
      rimLight.color.copy(cRimLightDay).lerp(cRimLightDark, currentThemeMix);
      rimLight.intensity = lerp(1.15, 1.85, currentThemeMix);
      prismAccentLight.intensity = lerp(0.65, 1.15, currentThemeMix);
      hemiLight.color.copy(cHemiSkyLight).lerp(cHemiSkyDark, currentThemeMix);
      hemiLight.groundColor.copy(cHemiGndLight).lerp(cHemiGndDark, currentThemeMix);
      hemiLight.intensity = lerp(1.15, 0.72, currentThemeMix);

      const nextLegendMode: "light" | "dark" = currentThemeMix > 0.5 ? "dark" : "light";
      const swapLegends = nextLegendMode !== legendMode;
      if (swapLegends) legendMode = nextLegendMode;

      // 5. Per-keycap tactile spring travel + frosted Apple Liquid Glass prism refraction
      for (let i = 0; i < keyRuntimes.length; i++) {
        const rt = keyRuntimes[i];

        // Spring-damped physical key travel with crisp tactile response
        const stiffness = rt.pressTarget > rt.pressCurrent ? 340 : 210;
        const damping = rt.pressTarget > rt.pressCurrent ? 25 : 19;
        const accel = (rt.pressTarget - rt.pressCurrent) * stiffness - rt.pressVelocity * damping;
        rt.pressVelocity += accel * dt;
        rt.pressCurrent = clamp01(rt.pressCurrent + rt.pressVelocity * dt);

        rt.motionGroup.position.y = 0.12 - rt.pressCurrent * KEY_TRAVEL;

        // Smooth glow boost on press
        rt.glowCurrent += (rt.pressTarget - rt.glowCurrent) * (1 - Math.exp(-dt * 16));

        // Render 1 target: 15%-frosted clear optical glass + 20% app color tint + vivid prism caustics
        rt.capMat.color.copy(rt.lightColor).lerp(rt.darkColor, currentThemeMix);
        if (rt.glowCurrent > 0.01) {
          rt.capMat.color.lerp(rt.accentColor, rt.glowCurrent * lerp(0.24, 0.38, currentThemeMix));
        }
        rt.capMat.attenuationColor.copy(rt.lightAtten).lerp(rt.darkAtten, currentThemeMix);
        rt.capMat.transmission = lerp(0.9, 0.86, currentThemeMix) - rt.glowCurrent * 0.04;
        rt.capMat.roughness = lerp(0.15, 0.13, currentThemeMix) - rt.glowCurrent * 0.03;
        rt.capMat.dispersion = lerp(6.2, 6.8, currentThemeMix) + rt.glowCurrent * 1.4;
        rt.capMat.iridescence = 1.0;
        rt.capMat.envMapIntensity = lerp(2.2, 1.8, currentThemeMix) + rt.glowCurrent * 0.45;
        rt.capMat.emissiveIntensity =
          lerp(0.02, 0.07, currentThemeMix) +
          rt.glowCurrent * lerp(0.22, 0.88, currentThemeMix);

        rt.ledMat.emissiveIntensity =
          lerp(0.48, 1.45, currentThemeMix) +
          rt.glowCurrent * lerp(1.05, 2.5, currentThemeMix);

        if (swapLegends) {
          rt.legendMat.map = legendMode === "dark" ? rt.darkTex : rt.lightTex;
          rt.legendMat.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    // Pause GPU completely when scrolled out of view or tab hidden
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isSectionVisible = Boolean(entry?.isIntersecting);
        if (isSectionVisible) {
          smoothP = getRawScroll();
          startLoop();
        } else {
          input.releaseAll();
          stopLoop();
        }
      },
      { rootMargin: "240px 0px 240px 0px", threshold: 0 }
    );

    if (sectionRef.current) {
      io.observe(sectionRef.current);
    } else {
      isSectionVisible = true;
      startLoop();
    }

    const onVisibility = () => {
      if (document.hidden) {
        input.releaseAll();
        stopLoop();
      } else if (isSectionVisible) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stopLoop();
      callbacksRef.current.onWebGLUnavailable();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      stopLoop();
      rippleFnRef.current = null;
      rippleTimers.forEach((id) => window.clearTimeout(id));
      unsubscribeInput();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);

      // Dispose GPU resources cleanly
      frameGeo.dispose();
      baseGeo.dispose();
      plateGeo.dispose();
      stripGeo.dispose();
      capGeo.dispose();
      switchHousingGeo.dispose();
      stemBarXGeo.dispose();
      stemBarZGeo.dispose();
      ledGeo.dispose();
      legendGeo.dispose();
      shadowGeo.dispose();

      caseMat.dispose();
      plateMat.dispose();
      stripMat.dispose();
      switchBaseMat.dispose();
      brownStemMat.dispose();
      shadowMat.dispose();

      shadowTex.dispose();
      envTarget.dispose();
      pmrem.dispose();

      for (const rt of keyRuntimes) {
        rt.capMat.dispose();
        rt.ledMat.dispose();
        rt.legendMat.dispose();
        rt.lightTex.dispose();
        rt.darkTex.dispose();
      }

      renderer.dispose();
      if (renderer.domElement.parentNode === blurLayer) {
        blurLayer.removeChild(renderer.domElement);
      }
    };
  }, [sectionRef, audioRef]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none"
      aria-label="Interactive 3D Glassmorphism Tech Stack Mechanical Keyboard"
    >
      <div
        ref={blurLayerRef}
        className="h-full w-full will-change-[transform,filter,opacity]"
      />
    </div>
  );
}
