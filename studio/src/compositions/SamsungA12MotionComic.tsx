import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// ============================================================
// SAMSUNG A12 — MOTION COMIC 2D
// 1080x1920 (vertical 9:16, Reels / TikTok / Shorts)
// Estilo: comic manga con onomatopeyas, speed lines, action accents.
// 11 viñetas x 3s c/u = 33s + intro + outro = 37s
// ============================================================

const PALETTE = {
  // Comic palette - alto contraste
  paper: "#F4ECD8",       // color de papel comic vintage
  ink: "#0D0D0D",         // negro de tinta
  inkSoft: "#2A2A2A",
  accent: "#E63946",      // rojo comic (sound FX)
  accentYellow: "#FFD60A", // amarillo caption
  accentBlue: "#1D3557",  // azul navy comic
  halftone: "rgba(13, 13, 13, 0.15)",
  panelBg: "#FFFEF7",
};

// Fonts
const FONT_COMIC =
  "'Bangers', 'Bungee', 'Impact', system-ui, sans-serif";
const FONT_BODY =
  "'Special Elite', 'Courier New', monospace";
const FONT_CAPTION =
  "'Special Elite', 'Courier New', monospace";

// Timing
const FPS = 30;
const INTRO_DURATION = 60;    // 2s
const OUTRO_DURATION = 60;    // 2s
const PANEL_DURATION = 90;    // 3s por panel
const PANEL_COUNT = 11;
const TOTAL = INTRO_DURATION + PANEL_COUNT * PANEL_DURATION + OUTRO_DURATION;
// = 60 + 990 + 60 = 1110 frames = 37s

const enter = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot para "snap"
const editorial = Easing.bezier(0.45, 0, 0.55, 1);

const panelStart = (i: number) => INTRO_DURATION + i * PANEL_DURATION;
const outroStart = INTRO_DURATION + PANEL_COUNT * PANEL_DURATION;

// ============================================================
// PANEL: la unidad base del comic
// ============================================================
type Panel = {
  imageIndex: number;       // 0-based, will be padded to 3 digits
  caption: string;          // texto narrativo arriba
  captionSize: number;      // tamano del caption
  onomatopeya: string;       // onomatopeya principal
  onomatopeya2?: string;     // onomatopeya secundaria (opcional)
  onomatopeyaColor: string;  // color del texto (rojo, amarillo, etc)
  onomatopeyaRot: number;    // rotacion en grados
  onomatopeyaPos: "tl" | "tr" | "bl" | "br" | "center";
  onomatopeyaSize: number;   // fontSize
  speedLines: boolean;       // muestra speed lines?
  speedLinesIntensity: number; // 0-1
  halftoneOverlay: boolean;  // muestra halftone dots?
  impact: "low" | "med" | "high"; // que tan dramatico es
};

const PANELS: Panel[] = [
  {
    imageIndex: 4,            // tapa trasera sola
    caption: "OPERACION A12: REPARACION",
    captionSize: 28,
    onomatopeya: "OK",
    onomatopeyaColor: PALETTE.accentBlue,
    onomatopeyaRot: -8,
    onomatopeyaPos: "tr",
    onomatopeyaSize: 80,
    speedLines: false,
    speedLinesIntensity: 0,
    halftoneOverlay: false,
    impact: "low",
  },
  {
    imageIndex: 9,            // espatula abriendo
    caption: "Calor... y spudger al rescate.",
    captionSize: 26,
    onomatopeya: "POP!",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -12,
    onomatopeyaPos: "tr",
    onomatopeyaSize: 140,
    speedLines: true,
    speedLinesIntensity: 0.5,
    halftoneOverlay: true,
    impact: "med",
  },
  {
    imageIndex: 14,           // pegamento en marco
    caption: "Adhesivo de precision.",
    captionSize: 28,
    onomatopeya: "SQUEEZE",
    onomatopeyaColor: PALETTE.accentBlue,
    onomatopeyaRot: 6,
    onomatopeyaPos: "bl",
    onomatopeyaSize: 100,
    speedLines: false,
    speedLinesIntensity: 0,
    halftoneOverlay: false,
    impact: "low",
  },
  {
    imageIndex: 19,           // placa separada (momento impactante)
    caption: "El corazon al descubierto.",
    captionSize: 26,
    onomatopeya: "SHOCK!",
    onomatopeya2: "WOW",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -15,
    onomatopeyaPos: "center",
    onomatopeyaSize: 180,
    speedLines: true,
    speedLinesIntensity: 0.8,
    halftoneOverlay: true,
    impact: "high",
  },
  {
    imageIndex: 24,           // destornillador en placa
    caption: "Precision milimetrica.",
    captionSize: 26,
    onomatopeya: "TIGHT!",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -8,
    onomatopeyaPos: "tr",
    onomatopeyaSize: 120,
    speedLines: true,
    speedLinesIntensity: 0.4,
    halftoneOverlay: false,
    impact: "med",
  },
  {
    imageIndex: 29,           // desconexion del flex
    caption: "Click. Flex liberado.",
    captionSize: 26,
    onomatopeya: "CLICK!",
    onomatopeyaColor: PALETTE.accentBlue,
    onomatopeyaRot: 5,
    onomatopeyaPos: "br",
    onomatopeyaSize: 110,
    speedLines: false,
    speedLinesIntensity: 0,
    halftoneOverlay: false,
    impact: "med",
  },
  {
    imageIndex: 39,           // tornillo USB
    caption: "Cada tornillo cuenta.",
    captionSize: 26,
    onomatopeya: "TIGHT",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -6,
    onomatopeyaPos: "tl",
    onomatopeyaSize: 100,
    speedLines: true,
    speedLinesIntensity: 0.3,
    halftoneOverlay: false,
    impact: "med",
  },
  {
    imageIndex: 54,           // tapa nueva con film
    caption: "Tapa nueva. Misma alma.",
    captionSize: 28,
    onomatopeya: "SHINE!",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -10,
    onomatopeyaPos: "tr",
    onomatopeyaSize: 130,
    speedLines: true,
    speedLinesIntensity: 0.6,
    halftoneOverlay: true,
    impact: "med",
  },
  {
    imageIndex: 59,           // alineacion tapa/camaras
    caption: "Alineacion perfecta.",
    captionSize: 26,
    onomatopeya: "CLICK",
    onomatopeyaColor: PALETTE.accentBlue,
    onomatopeyaRot: 4,
    onomatopeyaPos: "bl",
    onomatopeyaSize: 100,
    speedLines: false,
    speedLinesIntensity: 0,
    halftoneOverlay: false,
    impact: "low",
  },
  {
    imageIndex: 64,           // tapa ensamblada
    caption: "Sellado. Compacto. Listo.",
    captionSize: 26,
    onomatopeya: "SLAM!",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -8,
    onomatopeyaPos: "center",
    onomatopeyaSize: 150,
    speedLines: true,
    speedLinesIntensity: 0.7,
    halftoneOverlay: true,
    impact: "high",
  },
  {
    imageIndex: 69,           // boot Samsung
    caption: "El momento de la verdad.",
    captionSize: 28,
    onomatopeya: "POW!",
    onomatopeya2: "BOOT",
    onomatopeyaColor: PALETTE.accent,
    onomatopeyaRot: -12,
    onomatopeyaPos: "center",
    onomatopeyaSize: 200,
    speedLines: true,
    speedLinesIntensity: 1.0,
    halftoneOverlay: true,
    impact: "high",
  },
];

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

// Halftone dots overlay (estilo Marvel/comic)
const Halftone: React.FC<{ intensity: number; opacity: number }> = ({
  intensity,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(${PALETTE.ink} 1.2px, transparent 1.5px)`,
      backgroundSize: `${8 * (1 - intensity * 0.3)}px ${8 * (1 - intensity * 0.3)}px`,
      opacity: opacity * 0.4,
      mixBlendMode: "multiply",
      pointerEvents: "none",
    }}
  />
);

// Speed lines: lineas radiales desde el centro del panel
const SpeedLines: React.FC<{ intensity: number; rotation: number }> = ({
  intensity,
  rotation,
}) => {
  const lines = 24;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `rotate(${rotation}deg)`,
        opacity: intensity,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: lines }).map((_, i) => {
        const angle = (i / lines) * 360;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 2,
              height: 1200,
              backgroundColor: PALETTE.ink,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: "center",
            }}
          />
        );
      })}
      {/* Lineas adicionales mas cortas y gruesas (efecto manga) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360 + 15;
        return (
          <div
            key={`b-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 6,
              height: 700,
              backgroundColor: PALETTE.ink,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
};

// Border de vineta tipo comic (doble linea)
const PanelBorder: React.FC = () => (
  <>
    {/* Outer black border */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "8px solid #000",
        borderRadius: 4,
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
    {/* Inner white border (separador) */}
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: "2px solid #FFF",
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  </>
);

// Caption box arriba (estilo comic)
const CaptionBox: React.FC<{ text: string; fontSize: number; opacity: number }> = ({
  text,
  fontSize,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 36,
      right: 36,
      backgroundColor: PALETTE.accentYellow,
      border: "4px solid #000",
      borderRadius: 2,
      padding: "12px 16px",
      fontFamily: FONT_CAPTION,
      fontSize,
      fontWeight: 700,
      color: PALETTE.ink,
      letterSpacing: "0.04em",
      textAlign: "left",
      lineHeight: 1.3,
      textTransform: "uppercase",
      boxShadow: "4px 4px 0 #000",
      opacity,
      zIndex: 10,
    }}
  >
    {text}
  </div>
);

// Onomatopeya con stroke (tipico comic) y shadow 3D
const Onomatopeya: React.FC<{
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
  position: "tl" | "tr" | "bl" | "br" | "center";
  opacity: number;
  scale: number;
}> = ({ text, fontSize, color, rotation, position, opacity, scale }) => {
  const positions = {
    tl: { top: 120, left: 60 },
    tr: { top: 120, right: 60 },
    bl: { bottom: 120, left: 60 },
    br: { bottom: 120, right: 60 },
    center: { top: "50%", left: "50%" },
  };
  const pos = positions[position];

  return (
    <div
      style={{
        position: "absolute",
        ...(typeof pos.top === "number" ? { top: pos.top } : { top: pos.top, transform: `translate(-50%, -50%)` }),
        ...(pos.left !== undefined ? { left: pos.left } : {}),
        ...(pos.right !== undefined ? { right: pos.right } : {}),
        fontFamily: FONT_COMIC,
        fontSize: `${fontSize}px`,
        fontWeight: 900,
        color,
        letterSpacing: "0.02em",
        textAlign: "center",
        lineHeight: 0.9,
        textTransform: "uppercase",
        WebkitTextStroke: "4px #000",
        textShadow: "6px 6px 0 #000, 0 0 16px rgba(0,0,0,0.5)",
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// Action accent: stars/burst alrededor de la onomatopeya
const ActionAccents: React.FC<{
  count: number;
  radius: number;
  color: string;
  scale: number;
  rotation: number;
}> = ({ count, radius, color, scale, rotation }) => {
  const accents = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 360;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y, angle };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      {accents.map((a, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: a.x - 16,
            top: a.y - 16,
            width: 32,
            height: 32,
            color,
            fontSize: 32,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: "32px",
            WebkitTextStroke: "2px #000",
            textShadow: "2px 2px 0 #000",
          }}
        >
          ★
        </div>
      ))}
    </div>
  );
};

// ============================================================
// PANEL: cada viñeta del comic
// ============================================================
const PanelScene: React.FC<{ panel: Panel; index: number }> = ({
  panel,
  index,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // El panel entra desde abajo con bounce
  const panelY = interpolate(frame, [0, 12], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const panelScale = interpolate(
    frame,
    [0, 12, 18],
    [0.92, 1.02, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // La imagen aparece con flash
  const imageOpacity = interpolate(frame, [3, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageScale = interpolate(frame, [3, 18], [1.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash blanco inicial
  const flashOpacity = interpolate(frame, [3, 6, 12], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Caption box entra
  const captionOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(frame, [10, 18], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  // Onomatopeya: aparece con overshoot
  const onoDelay = panel.impact === "high" ? 8 : panel.impact === "med" ? 12 : 18;
  const onoScale = interpolate(
    frame,
    [onoDelay, onoDelay + 6, onoDelay + 10],
    [0, 1.3, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );
  const onoOpacity = interpolate(frame, [onoDelay, onoDelay + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent stars
  const accentScale = interpolate(
    frame,
    [onoDelay + 4, onoDelay + 14],
    [0, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );
  const accentRotation = frame * 3; // rotacion constante

  // Speed lines: aparecen rapido, se desvanecen
  const speedFadeIn = interpolate(frame, [onoDelay + 2, onoDelay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const speedFadeOut = interpolate(
    frame,
    [PANEL_DURATION - 20, PANEL_DURATION - 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const speedOpacity = Math.min(speedFadeIn, speedFadeOut) * panel.speedLinesIntensity;

  // Halftone overlay
  const halftoneOpacity = interpolate(
    frame,
    [onoDelay, onoDelay + 8, PANEL_DURATION - 10, PANEL_DURATION - 2],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Color grade de la imagen: mas contraste, mas saturacion
  const colorGrade = panel.impact === "high"
    ? "saturate(1.4) contrast(1.15) brightness(1.05)"
    : "saturate(1.15) contrast(1.08)";

  // El panel sale
  const exitOpacity = interpolate(
    frame,
    [PANEL_DURATION - 8, PANEL_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const paddedIdx = String(panel.imageIndex + 1).padStart(3, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 36,
          right: 36,
          bottom: 200,
          opacity: exitOpacity,
          transform: `translateY(${panelY}px) scale(${panelScale})`,
        }}
      >
        {/* Fondo del panel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: PALETTE.panelBg,
            border: "8px solid #000",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "6px 6px 0 #000",
          }}
        >
          {/* Imagen con color grade */}
          <Img
            src={staticFile(`samsung-a12/a12-${paddedIdx}.webp`)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: imageOpacity,
              scale: `${imageScale}`,
              filter: colorGrade,
            }}
          />

          {/* Halftone overlay */}
          {panel.halftoneOverlay && (
            <Halftone
              intensity={0.7}
              opacity={halftoneOpacity * (panel.impact === "high" ? 1 : 0.6)}
            />
          )}

          {/* Speed lines (sobre la imagen) */}
          {panel.speedLines && speedOpacity > 0 && (
            <SpeedLines
              intensity={speedOpacity}
              rotation={(frame * 1.5) % 360}
            />
          )}

          {/* Flash inicial */}
          {flashOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#FFF",
                opacity: flashOpacity,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Border de la viñeta (sobre la imagen) */}
          <PanelBorder />

          {/* Caption box */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              right: 40,
              opacity: captionOpacity,
              translate: `0 ${captionY}px`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                backgroundColor: PALETTE.accentYellow,
                border: "4px solid #000",
                borderRadius: 2,
                padding: "12px 16px",
                fontFamily: FONT_CAPTION,
                fontSize: panel.captionSize,
                fontWeight: 700,
                color: PALETTE.ink,
                letterSpacing: "0.04em",
                textAlign: "left",
                lineHeight: 1.2,
                textTransform: "uppercase",
                boxShadow: "4px 4px 0 #000",
              }}
            >
              {panel.caption}
            </div>
          </div>

          {/* Onomatopeya principal */}
          <Onomatopeya
            text={panel.onomatopeya}
            fontSize={panel.onomatopeyaSize}
            color={panel.onomatopeyaColor}
            rotation={panel.onomatopeyaRot}
            position={panel.onomatopeyaPos}
            opacity={onoOpacity}
            scale={onoScale}
          />

          {/* Onomatopeya secundaria (si existe) */}
          {panel.onomatopeya2 && (
            <Onomatopeya
              text={panel.onomatopeya2}
              fontSize={panel.onomatopeyaSize * 0.5}
              color={PALETTE.accentYellow}
              rotation={-panel.onomatopeyaRot}
              position={
                panel.onomatopeyaPos === "tl" ? "br" :
                panel.onomatopeyaPos === "tr" ? "bl" :
                panel.onomatopeyaPos === "bl" ? "tr" : "tl"
              }
              opacity={onoOpacity * 0.9}
              scale={onoScale * 0.8}
            />
          )}

          {/* Action accents (estrellas) */}
          {(panel.impact === "high" || panel.impact === "med") && (
            <ActionAccents
              count={panel.impact === "high" ? 8 : 5}
              radius={panel.onomatopeyaSize * 0.7}
              color={panel.onomatopeyaColor}
              scale={accentScale}
              rotation={accentRotation}
            />
          )}
        </div>
      </div>

      {/* Page number / footer comic */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 60px",
          fontFamily: FONT_COMIC,
          fontSize: 32,
          color: PALETTE.ink,
          letterSpacing: "0.05em",
          opacity: exitOpacity,
        }}
      >
        <span>// SIERRA TECH</span>
        <span
          style={{
            fontSize: 28,
            padding: "4px 14px",
            border: "3px solid #000",
            borderRadius: 4,
            backgroundColor: PALETTE.ink,
            color: PALETTE.paper,
          }}
        >
          {String(index + 1).padStart(2, "0")} / 11
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// INTRO: portada del comic
// ============================================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleScale = interpolate(frame, [10, 25, 30], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const titleOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [50, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.paper,
        opacity: exitOpacity,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Halftone background */}
      <Halftone intensity={0.3} opacity={1} />

      {/* Speed lines rotando */}
      <SpeedLines intensity={0.4} rotation={frame * 1.5} />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: FONT_CAPTION,
            fontSize: 24,
            color: PALETTE.ink,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: titleOpacity,
          }}
        >
          // SIERRA TECH PRESENTA
        </div>

        {/* Title comic */}
        <div
          style={{
            fontFamily: FONT_COMIC,
            fontSize: 140,
            fontWeight: 900,
            color: PALETTE.accent,
            letterSpacing: "0.02em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            WebkitTextStroke: "6px #000",
            textShadow: "10px 10px 0 #000, 0 0 32px rgba(230,57,70,0.5)",
            opacity: titleOpacity,
            transform: `scale(${titleScale}) rotate(-4deg)`,
          }}
        >
          ¡POW!
        </div>

        <div
          style={{
            fontFamily: FONT_COMIC,
            fontSize: 100,
            fontWeight: 900,
            color: PALETTE.accentBlue,
            letterSpacing: "0.02em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            WebkitTextStroke: "4px #000",
            textShadow: "6px 6px 0 #000",
            opacity: titleOpacity,
            transform: `scale(${titleScale}) rotate(2deg)`,
          }}
        >
          SAMSUNG A12
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT_CAPTION,
            fontSize: 26,
            color: PALETTE.ink,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: subOpacity,
            padding: "10px 20px",
            backgroundColor: PALETTE.accentYellow,
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
          }}
        >
          Cambio de pantalla y tapa trasera
        </div>

        <div
          style={{
            fontFamily: FONT_CAPTION,
            fontSize: 20,
            color: PALETTE.inkSoft,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: 12,
            opacity: subOpacity,
          }}
        >
          // Capitulo 01
        </div>
      </div>

      {/* Halftone overlay final */}
      <Halftone intensity={0.5} opacity={0.3} />
    </AbsoluteFill>
  );
};

// ============================================================
// OUTRO: cierre
// ============================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Stagger: LISTO entra primero (top), SierraTech entra despues (centro)
  const listoScale = interpolate(frame, [5, 18, 22], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const listoOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [18, 32, 36], [0, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const logoOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [32, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagOpacity = interpolate(frame, [42, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.paper,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <Halftone intensity={0.3} opacity={1} />
      <SpeedLines intensity={0.4} rotation={frame * -1.5} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          paddingTop: 100,
          zIndex: 10,
        }}
      >
        {/* LISTO arriba */}
        <div
          style={{
            fontFamily: FONT_COMIC,
            fontSize: 130,
            fontWeight: 900,
            color: PALETTE.accent,
            letterSpacing: "0.02em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            WebkitTextStroke: "6px #000",
            textShadow: "10px 10px 0 #000, 0 0 32px rgba(230,57,70,0.4)",
            opacity: listoOpacity,
            transform: `scale(${listoScale}) rotate(-6deg)`,
            marginBottom: 80,
          }}
        >
          ¡LISTO!
        </div>

        {/* SierraTech centro - mas chico, con fondo para tapar el LISTO */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            padding: "32px 60px",
            backgroundColor: PALETTE.paper,
            border: "6px solid #000",
            borderRadius: 4,
            boxShadow: "8px 8px 0 #000",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_COMIC,
              fontSize: 96,
              fontWeight: 900,
              color: PALETTE.ink,
              letterSpacing: "0.02em",
              lineHeight: 0.9,
              textTransform: "uppercase",
              WebkitTextStroke: "3px #000",
              textShadow: "4px 4px 0 #000",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span style={{ color: PALETTE.ink }}>Sierra</span>
            <span style={{ color: PALETTE.accent, marginLeft: 4 }}>Tech</span>
          </div>

          {/* Hardware + Software caption box */}
          <div
            style={{
              fontFamily: FONT_CAPTION,
              fontSize: 24,
              color: PALETTE.ink,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              opacity: subOpacity,
              padding: "12px 24px",
              backgroundColor: PALETTE.accentYellow,
              border: "3px solid #000",
              boxShadow: "4px 4px 0 #000",
            }}
          >
            Hardware + Software
          </div>
        </div>

        {/* Tag al pie */}
        <div
          style={{
            fontFamily: FONT_CAPTION,
            fontSize: 18,
            color: PALETTE.inkSoft,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: tagOpacity,
            marginTop: 80,
          }}
        >
          Almagro, Buenos Aires · © 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSICION PRINCIPAL
// ============================================================
export const SamsungA12MotionComic: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroScene />
      </Sequence>

      {PANELS.map((panel, i) => (
        <Sequence
          key={i}
          from={panelStart(i)}
          durationInFrames={PANEL_DURATION}
        >
          <PanelScene panel={panel} index={i} />
        </Sequence>
      ))}

      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
