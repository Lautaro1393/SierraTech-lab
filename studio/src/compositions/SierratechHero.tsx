import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const PALETTE = {
  void: "#0D1117",
  navy: "#18243D",
  navyHi: "#1F2937",
  ink: "#DCE2F3",
  muted: "#9CA3AF",
  accent: "#2EDC1B",
  accentSoft: "rgba(46, 220, 27, 0.18)",
  outline: "rgba(255, 255, 255, 0.08)",
};

const FONT_DISPLAY =
  "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";

// 60 líneas radiales + 12 anillos = sensación de "banco de trabajo bajo el microscopio"
const RADIAL_LINES = 60;
const RINGS = 12;

export const SierratechHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  // Loop: la animación vuelve a empezar al final
  const loopProgress = (frame % durationInFrames) / durationInFrames;
  const slowRotation = loopProgress * 360;
  const fastRotation = loopProgress * 720;

  // Pulso del reticle central
  const pulse = interpolate(
    Math.sin(loopProgress * Math.PI * 2),
    [-1, 1],
    [0.6, 1]
  );

  // Scan line horizontal que cruza
  const scanY = interpolate(
    loopProgress,
    [0, 1],
    [-100, height + 100],
    { extrapolateRight: "clamp" }
  );

  // Texto del centro: fade in/out cíclico
  const titleOpacity = interpolate(
    loopProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.void }}>
      {/* Capa 1: gradiente radial suave desde el centro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${PALETTE.navy} 0%, ${PALETTE.void} 60%)`,
        }}
      />

      {/* Capa 2: anillos concéntricos (microscopio) */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `rotate(${slowRotation * 0.1}deg)`,
        }}
      >
        {Array.from({ length: RINGS }).map((_, i) => {
          const r = ((i + 1) / RINGS) * maxRadius * 0.9;
          const opacity = interpolate(
            Math.abs(loopProgress * RINGS - i) % 1,
            [0, 0.5, 1],
            [0.4, 0.05, 0.4]
          );
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx - r,
                top: cy - r,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                border: `1px solid ${PALETTE.accent}`,
                opacity,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Capa 3: líneas radiales (reticle) */}
      <AbsoluteFill
        style={{
          transform: `rotate(${slowRotation}deg)`,
        }}
      >
        {Array.from({ length: RADIAL_LINES }).map((_, i) => {
          const angle = (i / RADIAL_LINES) * 360;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                width: 1,
                height: maxRadius,
                background: `linear-gradient(180deg, transparent, ${PALETTE.outline} 30%, ${PALETTE.outline} 70%, transparent)`,
                transform: `rotate(${angle}deg) translateY(-${maxRadius * 0.05}px)`,
                transformOrigin: "top center",
                opacity: 0.5,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Capa 4: anillos tick mark (como un instrumento) */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `rotate(${-fastRotation * 0.05}deg)`,
        }}
      >
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i / 72) * 360;
          const isMajor = i % 6 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx,
                top: cy - 320,
                width: 1,
                height: isMajor ? 16 : 8,
                backgroundColor: PALETTE.accent,
                transform: `rotate(${angle}deg)`,
                transformOrigin: `0 ${320}px`,
                opacity: isMajor ? 0.7 : 0.3,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Capa 5: reticle central (cruz) */}
      <div
        style={{
          position: "absolute",
          left: cx - 200,
          top: cy - 1,
          width: 400,
          height: 2,
          backgroundColor: PALETTE.accent,
          opacity: pulse * 0.5,
          boxShadow: `0 0 8px ${PALETTE.accent}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - 1,
          top: cy - 200,
          width: 2,
          height: 400,
          backgroundColor: PALETTE.accent,
          opacity: pulse * 0.5,
          boxShadow: `0 0 8px ${PALETTE.accent}`,
        }}
      />

      {/* Capa 6: centro pequeño (punto de mira) */}
      <div
        style={{
          position: "absolute",
          left: cx - 8,
          top: cy - 8,
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `2px solid ${PALETTE.accent}`,
          opacity: pulse,
          boxShadow: `0 0 16px ${PALETTE.accent}`,
        }}
      />

      {/* Capa 7: scan line horizontal */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${PALETTE.accent} 50%, transparent 100%)`,
          boxShadow: `0 0 32px ${PALETTE.accent}, 0 0 64px ${PALETTE.accent}`,
          opacity: 0.8,
        }}
      />

      {/* Capa 8: title + tagline centrado */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: 64,
            background: "rgba(13, 17, 23, 0.55)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${PALETTE.outline}`,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 14,
              color: PALETTE.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            // SIERRA TECH_LAB
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: PALETTE.ink,
              textAlign: "center",
            }}
          >
            Arquitectura Tecnológica
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              color: PALETTE.muted,
              letterSpacing: "0.02em",
              textAlign: "center",
              maxWidth: 720,
            }}
          >
            Desde la soldadura de precisión hasta el despliegue de software.
          </div>
        </div>
      </AbsoluteFill>

      {/* Capa 9: HUD inferior (instrumento) */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT_MONO,
          fontSize: 13,
          color: PALETTE.muted,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", gap: 32 }}>
          <span>
            <span style={{ color: PALETTE.accent }}>●</span> REC
          </span>
          <span>FPS 30</span>
          <span>1920×1080</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <span>SN:ST-{((frame * 9301 + 49297) % 233280).toString().padStart(6, "0")}</span>
          <span>© 2026 SIERRA TECH</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
