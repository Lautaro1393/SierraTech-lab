import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// Background animado para el hero de la home.
// Solo elementos visuales sutiles: grid técnico, scan line, anillos, glow radial.
// Sin texto ni HUD — el texto vive en el HTML encima del video.
// Loop perfecto: 8s @ 30fps = 240 frames.

const PALETTE = {
  void: "#0D1117",
  navy: "#18243D",
  navyHi: "#1F2937",
  accent: "#2EDC1B",
  accentSoft: "rgba(46, 220, 27, 0.18)",
  accentTrace: "rgba(46, 220, 27, 0.08)",
  outline: "rgba(255, 255, 255, 0.05)",
};

const RINGS = 8;
const RADIAL_LINES = 48;

export const SierratechHeroBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  // Loop: 0 → 1 → 0 a lo largo del video
  const loopProgress = (frame % durationInFrames) / durationInFrames;
  // Animar de 0 a 1 (ida) y de 1 a 0 (vuelta) para que el final == inicio
  const eased = Math.sin(loopProgress * Math.PI * 2);

  // Rotación lenta de los anillos
  const ringRotation = loopProgress * 360;
  // Rotación opuesta de las líneas radiales
  const lineRotation = -loopProgress * 180;

  // Scan line horizontal: cruza de arriba a abajo
  const scanY = interpolate(loopProgress, [0, 1], [-100, height + 100], {
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(
    Math.abs(eased),
    [-1, 0, 1],
    [0.3, 0.6, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Pulso del centro
  const pulse = interpolate(eased, [-1, 1], [0.4, 0.9]);

  // Drift del grid
  const gridDrift = loopProgress * 60;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.void, overflow: "hidden" }}>
      {/* Gradient radial base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at center, ${PALETTE.navy} 0%, ${PALETTE.void} 60%, ${PALETTE.void} 100%)`,
        }}
      />

      {/* Grid técnico con drift */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${PALETTE.accentTrace} 1px, transparent 1px),
            linear-gradient(90deg, ${PALETTE.accentTrace} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${gridDrift}px`,
          opacity: 0.5,
        }}
      />

      {/* Anillos concéntricos rotando */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `rotate(${ringRotation * 0.05}deg)`,
        }}
      >
        {Array.from({ length: RINGS }).map((_, i) => {
          const r = ((i + 1) / RINGS) * maxRadius * 0.9;
          const opacity = interpolate(
            Math.abs(((loopProgress * RINGS - i) % 1)),
            [0, 0.5, 1],
            [0.18, 0.04, 0.18]
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

      {/* Líneas radiales */}
      <AbsoluteFill
        style={{
          transform: `rotate(${lineRotation}deg)`,
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
                transform: `rotate(${angle}deg)`,
                transformOrigin: "top center",
                opacity: 0.3,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Scan line horizontal */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY - 1,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${PALETTE.accent} 50%, transparent 100%)`,
          boxShadow: `0 0 24px ${PALETTE.accent}`,
          opacity: scanOpacity,
        }}
      />

      {/* Glow central pulsante */}
      <div
        style={{
          position: "absolute",
          left: cx - 6,
          top: cy - 6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: PALETTE.accent,
          boxShadow: `0 0 ${20 * pulse}px ${PALETTE.accent}`,
          opacity: pulse * 0.8,
        }}
      />

      {/* Vignette para oscurecer los bordes */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${PALETTE.void} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
