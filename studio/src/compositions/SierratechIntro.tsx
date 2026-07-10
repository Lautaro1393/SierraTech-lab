import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
} from "remotion";

const PALETTE = {
  void: "#0D1117",
  voidDeep: "#070A0F",
  navy: "#18243D",
  navyHi: "#1F2937",
  ink: "#DCE2F3",
  inkDim: "#A8B0B8",
  muted: "#6B7280",
  accent: "#2EDC1B",
  accentDim: "rgba(46, 220, 27, 0.4)",
  accentSoft: "rgba(46, 220, 27, 0.18)",
  accentTrace: "rgba(46, 220, 27, 0.08)",
  outline: "rgba(255, 255, 255, 0.06)",
  outlineStrong: "rgba(255, 255, 255, 0.14)",
};

const FONT_DISPLAY =
  "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";

// "SierraTech" → 10 letras. La 'S' (índice 0) lleva el accent verde.
const LETTERS: string[] = ["S", "i", "e", "r", "r", "a", "T", "e", "c", "h"];

const TOTAL = 240;
const FPS = 30;

// Timing constants
const SCAN_V_START = 0; // scan vertical cruza 0–30
const SCAN_V_END = 30;
const GRID_FADE_START = 5;
const GRID_FADE_END = 35;
const LETTER_START = 30; // 1.0s
const LETTER_STAGGER = 5; // cada letra 5 frames después
const LETTER_DURATION = 18; // cada letra tarda 18 frames en revelarse
const TAGLINE_START = 95; // ~3.15s
const TAGLINE_LINE_GAP = 12;
const UNDERLINE_START = 150; // 5s
const UNDERLINE_DURATION = 30;
const HUD_START = 165; // 5.5s
const SCAN_H_START = 180;
const SCAN_H_END = 210;
const FADE_OUT_START = 215;
const FADE_OUT_END = 240;

const enter = Easing.bezier(0.16, 1, 0.3, 1); // crisp UI entrance
const editorial = Easing.bezier(0.45, 0, 0.55, 1); // editorial / slow fade

// Componente de una sola letra con reveal tipo wipe
const Letter: React.FC<{
  char: string;
  index: number;
  startFrame: number;
  isAccent: boolean;
}> = ({ char, index, startFrame, isAccent }) => {
  const frame = useCurrentFrame();
  const relative = frame - startFrame;

  // Wipe horizontal: clip-path inset va de (0 0 100% 0) a (0 0 0 0)
  // (left inset queda igual, right inset baja de 100% a 0%)
  const wipe = interpolate(relative, [0, LETTER_DURATION], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enter,
  });

  // Pequeño blur que se quita al final del wipe
  const blur = interpolate(relative, [0, LETTER_DURATION * 0.6, LETTER_DURATION], [4, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Translate Y sutil al inicio
  const yOffset = interpolate(relative, [0, LETTER_DURATION], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enter,
  });

  // Chromatic aberration en el último 25% del reveal
  const aberration = interpolate(
    relative,
    [LETTER_DURATION * 0.75, LETTER_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const color = isAccent ? PALETTE.accent : PALETTE.ink;
  const glow = isAccent
    ? `0 0 24px ${PALETTE.accentDim}, 0 0 48px ${PALETTE.accentTrace}`
    : "none";

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        color,
        textShadow: glow,
        clipPath: `inset(0 ${wipe}% 0 0)`,
        translate: `0 ${yOffset}px`,
        filter: `blur(${blur}px)`,
      }}
    >
      {/* Capa RGB split para chromatic aberration */}
      {aberration > 0 && (
        <>
          <span
            style={{
              position: "absolute",
              inset: 0,
              color: "#FF0066",
              opacity: aberration * 0.5,
              translate: `${aberration * 2}px 0`,
              mixBlendMode: "screen",
            }}
            aria-hidden
          >
            {char}
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              color: "#00D4FF",
              opacity: aberration * 0.5,
              translate: `${-aberration * 2}px 0`,
              mixBlendMode: "screen",
            }}
            aria-hidden
          >
            {char}
          </span>
        </>
      )}
      <span style={{ position: "relative" }}>{char}</span>
    </span>
  );
};

export const SierratechIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background fade-in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grid técnico: fade in + leve drift hacia abajo
  const gridOpacity = interpolate(frame, [GRID_FADE_START, GRID_FADE_END], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: editorial,
  });
  const gridDrift = interpolate(frame, [0, TOTAL], [0, 60], {
    extrapolateRight: "clamp",
  });

  // Scan vertical inicial: cruza de izquierda a derecha
  const scanX = interpolate(frame, [SCAN_V_START, SCAN_V_END], [-200, width + 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: editorial,
  });
  const scanVOpacity = interpolate(
    frame,
    [SCAN_V_START, SCAN_V_START + 4, SCAN_V_END - 6, SCAN_V_END],
    [0, 0.9, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scan horizontal tardío
  const scanH = interpolate(frame, [SCAN_H_START, SCAN_H_END], [-100, height + 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanHOpacity = interpolate(
    frame,
    [SCAN_H_START, SCAN_H_START + 4, SCAN_H_END - 6, SCAN_H_END],
    [0, 0.6, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo: opacity global, scale sutil al final del reveal
  const logoStart = LETTER_START + LETTERS.length * LETTER_STAGGER; // cuando termina la última letra
  const logoScale = interpolate(
    frame,
    [logoStart, logoStart + 25],
    [1, 1.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.56, 0.64, 1), // overshoot sutil
    }
  );

  // Pulse del accent: durante el hold (150-210) el accent late
  const pulse = interpolate(
    Math.sin(((frame - 150) / 60) * Math.PI * 2),
    [-1, 1],
    [0.7, 1]
  );
  const pulseOpacity = interpolate(
    frame,
    [150, 165, 210, 225],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline: 3 líneas con stagger
  const taglineLines = [
    "Reparación · Micro-soldadura",
    "Web a medida · AppSheet",
    "Almagro, Buenos Aires",
  ];

  // Underline accent: scaleX desde el centro
  const underlineScale = interpolate(
    frame,
    [UNDERLINE_START, UNDERLINE_START + UNDERLINE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: enter }
  );

  // HUD inferior: fade + slide
  const hudY = interpolate(frame, [HUD_START, HUD_START + 18], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: enter,
  });
  const hudOpacity = interpolate(
    frame,
    [HUD_START, HUD_START + 12, FADE_OUT_START, FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out final al void
  const fadeOut = interpolate(
    frame,
    [FADE_OUT_START, FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: editorial }
  );

  // Corner brackets: aparecen sincronizados con el logo
  const bracketsOpacity = interpolate(
    frame,
    [LETTER_START, LETTER_START + 20, FADE_OUT_START, FADE_OUT_END],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Grain estático (ruido sutil) — precomputado como una grilla de puntos
  const grainOpacity = interpolate(
    frame,
    [0, 20, FADE_OUT_START, FADE_OUT_END],
    [0, 0.06, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.voidDeep,
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      {/* Background gradient radial */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          background: `radial-gradient(ellipse at center, ${PALETTE.navy} 0%, ${PALETTE.void} 50%, ${PALETTE.voidDeep} 100%)`,
        }}
      />

      {/* Grid técnico sutil con drift */}
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(${PALETTE.accentTrace} 1px, transparent 1px),
            linear-gradient(90deg, ${PALETTE.accentTrace} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${gridDrift}px`,
        }}
      />

      {/* Grain cinematográfico: grilla de puntos aleatorios (estáticos) */}
      <AbsoluteFill
        style={{
          opacity: grainOpacity,
          backgroundImage: `radial-gradient(${PALETTE.ink} 1px, transparent 1px)`,
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Scan vertical inicial (apertura tipo CRT) */}
      <div
        style={{
          position: "absolute",
          left: scanX - 1,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(180deg, transparent, ${PALETTE.accent}, transparent)`,
          boxShadow: `0 0 32px ${PALETTE.accent}, 0 0 64px ${PALETTE.accent}`,
          opacity: scanVOpacity,
        }}
      />

      {/* Scan horizontal tardío */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanH - 1,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${PALETTE.accent}, transparent)`,
          boxShadow: `0 0 24px ${PALETTE.accent}`,
          opacity: scanHOpacity,
        }}
      />

      {/* Contenido central */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            scale: logoScale > 1 ? logoScale : undefined,
          }}
        >
          {/* Eyebrow sobre el logo */}
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              fontWeight: 700,
              color: PALETTE.accent,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: interpolate(
                frame,
                [LETTER_START - 5, LETTER_START + 10],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              translate: `0 ${interpolate(
                frame,
                [LETTER_START - 5, LETTER_START + 10],
                [10, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: enter }
              )}px`,
            }}
          >
            // SIERRA TECH_LAB
          </div>

          {/* Logo letter-by-letter */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 220,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            {LETTERS.map((char, i) => (
              <Letter
                key={i}
                char={char}
                index={i}
                startFrame={LETTER_START + i * LETTER_STAGGER}
                isAccent={i === 0}
              />
            ))}
          </div>

          {/* Underline accent que se dibuja */}
          <div
            style={{
              position: "relative",
              width: 520,
              height: 3,
              backgroundColor: PALETTE.outline,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: PALETTE.accent,
                boxShadow: `0 0 12px ${PALETTE.accent}`,
                transformOrigin: "left center",
                scale: `${underlineScale} 1`,
                opacity: pulseOpacity,
              }}
            />
          </div>

          {/* Tagline con stagger de líneas */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {taglineLines.map((line, i) => {
              const lineStart = TAGLINE_START + i * TAGLINE_LINE_GAP;
              const lineOpacity = interpolate(
                frame,
                [lineStart, lineStart + 14, FADE_OUT_START, FADE_OUT_END],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const lineY = interpolate(
                frame,
                [lineStart, lineStart + 14],
                [10, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: enter }
              );
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 20,
                    color: i === 2 ? PALETTE.ink : PALETTE.inkDim,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: lineOpacity,
                    translate: `0 ${lineY}px`,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* Corner brackets (4) */}
      {[
        { top: 100, left: 100, borderTop: true, borderLeft: true },
        { top: 100, right: 100, borderTop: true, borderRight: true },
        { bottom: 100, right: 100, borderBottom: true, borderRight: true },
        { bottom: 100, left: 100, borderBottom: true, borderLeft: true },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 48,
            height: 48,
            borderTop: pos.borderTop ? `2px solid ${PALETTE.accent}` : undefined,
            borderLeft: pos.borderLeft ? `2px solid ${PALETTE.accent}` : undefined,
            borderRight: pos.borderRight ? `2px solid ${PALETTE.accent}` : undefined,
            borderBottom: pos.borderBottom ? `2px solid ${PALETTE.accent}` : undefined,
            opacity: bracketsOpacity,
          }}
        />
      ))}

      {/* HUD inferior */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 100,
          right: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_MONO,
          fontSize: 16,
          color: PALETTE.muted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: hudOpacity,
          translate: `0 ${hudY}px`,
        }}
      >
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: PALETTE.accent,
                boxShadow: `0 0 8px ${PALETTE.accent}`,
                opacity: pulse * pulseOpacity,
              }}
            />
            REC
          </span>
          <span>1920×1080 · 30FPS</span>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <span>
            SN:ST-
            {((frame * 9301 + 49297) % 233280).toString().padStart(6, "0")}
          </span>
          <span>© 2026</span>
        </div>
      </div>

      {/* Barra de progreso sutil (top) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: PALETTE.outline,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / TOTAL) * 100}%`,
            backgroundColor: PALETTE.accent,
            boxShadow: `0 0 8px ${PALETTE.accent}`,
            opacity: 0.6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
