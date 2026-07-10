import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

const PALETTE = {
  void: "#0D1117",
  navy: "#18243D",
  ink: "#DCE2F3",
  muted: "#9CA3AF",
  accent: "#2EDC1B",
  accentSoft: "rgba(46, 220, 27, 0.18)",
};

const FONT_DISPLAY =
  "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";

export const SierratechIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Línea de scan que cruza la pantalla al inicio
  const scanY = interpolate(frame, [0, 60], [1080, -200], {
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [0, 10, 55, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Texto del logo: fade + slide
  const logoScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });
  const logoOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline: aparece después
  const tagOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [60, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Línea accent que aparece
  const accentWidth = interpolate(frame, [75, 110], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Eyebrow: glitch terminal
  const typedChars = Math.floor(interpolate(frame, [90, 130], [0, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const eyebrowText = "// INITIALIZING_";
  const cursor = frame % 30 < 15 ? "█" : " ";

  // Fade out al final
  const outOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.void,
        fontFamily: FONT_DISPLAY,
        color: PALETTE.ink,
        opacity: outOpacity,
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${PALETTE.accent}, transparent)`,
          boxShadow: `0 0 24px ${PALETTE.accent}, 0 0 48px ${PALETTE.accent}`,
          opacity: scanOpacity,
        }}
      />

      {/* Grid sutil de fondo */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${PALETTE.accentSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${PALETTE.accentSoft} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }}
      />

      {/* Contenido centrado */}
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
            gap: 32,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          {/* Logo wordmark */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span style={{ color: PALETTE.ink }}>SIERRA</span>
            <span style={{ color: PALETTE.accent, marginLeft: 12 }}>TECH</span>
            <span
              style={{
                color: PALETTE.muted,
                fontWeight: 500,
                marginLeft: 4,
                fontFamily: FONT_MONO,
                fontSize: 72,
              }}
            >
              _LAB
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              color: PALETTE.muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              textAlign: "center",
            }}
          >
            Hardware + Software · Almagro, Buenos Aires
          </div>
        </div>

        {/* Línea accent */}
        <div
          style={{
            position: "absolute",
            top: 720,
            width: accentWidth,
            height: 3,
            backgroundColor: PALETTE.accent,
            boxShadow: `0 0 16px ${PALETTE.accent}`,
          }}
        />

        {/* Eyebrow con cursor */}
        <div
          style={{
            position: "absolute",
            top: 760,
            fontFamily: FONT_MONO,
            fontSize: 18,
            color: PALETTE.accent,
            letterSpacing: "0.1em",
          }}
        >
          {eyebrowText.slice(0, typedChars)}
          {cursor}
        </div>
      </AbsoluteFill>

      {/* Corner brackets */}
      {[
        { top: 60, left: 60, transform: "rotate(0deg)" },
        { top: 60, right: 60, transform: "rotate(90deg)" },
        { bottom: 60, right: 60, transform: "rotate(180deg)" },
        { bottom: 60, left: 60, transform: "rotate(270deg)" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 32,
            height: 32,
            borderTop: `2px solid ${PALETTE.accent}`,
            borderLeft: `2px solid ${PALETTE.accent}`,
            opacity: interpolate(frame, [5, 20], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      ))}

      {/* Serial number abajo derecha */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 60,
          fontFamily: FONT_MONO,
          fontSize: 12,
          color: PALETTE.muted,
          letterSpacing: "0.1em",
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        SN:ST-{((frame * 9301 + 49297) % 233280).toString().padStart(6, "0")}
      </div>
    </AbsoluteFill>
  );
};
