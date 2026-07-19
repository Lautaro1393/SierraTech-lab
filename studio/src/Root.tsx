import React from "react";
import { Composition, registerRoot } from "remotion";
import { SierratechIntro } from "./compositions/SierratechIntro";
import { SierratechHero } from "./compositions/SierratechHero";
import { SierratechHeroBg } from "./compositions/SierratechHeroBg";
import { AuricularReparacion } from "./compositions/AuricularReparacion";
import { AuricularReparacionVertical } from "./compositions/AuricularReparacionVertical";
import { AuricularReparacionVerticalAudio } from "./compositions/AuricularReparacionVerticalAudio";
import { SamsungA12MotionComic } from "./compositions/SamsungA12MotionComic";

// Intro: 8s, 1920x1080 (cinematic widescreen intro de marca)
// Hero: 10s, 1920x1080 (loopable, fondo de la home)
// HeroBg: 8s, 1920x1080 (background sutil para el hero de la home)
// AuricularReparacion: 25.2s, 1920x1080 (documental técnico, 5 pasos + intro + outro)
// AuricularReparacionVertical: 27.2s, 1080x1920 (versión vertical para redes, +logo al final)
// AuricularReparacionVerticalAudio: 27.2s, 1080x1920 (+ música + SFX sincronizados)
// SamsungA12MotionComic: 37s, 1080x1920 (motion comic 2D con onomatopeyas, speed lines, action accents)
//   Intro: 2s, 11 paneles x 3s = 33s, Outro: 2s
const SAMSUNG_A12_COMIC_DURATION = 60 + 11 * 90 + 60; // 1110 frames = 37s

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SierratechIntro"
        component={SierratechIntro}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SierratechHero"
        component={SierratechHero}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SierratechHeroBg"
        component={SierratechHeroBg}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AuricularReparacion"
        component={AuricularReparacion}
        durationInFrames={60 + 5 * 126 + 60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AuricularReparacionVertical"
        component={AuricularReparacionVertical}
        durationInFrames={60 + 5 * 126 + 60 + 60}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AuricularReparacionVerticalAudio"
        component={AuricularReparacionVerticalAudio}
        durationInFrames={60 + 5 * 126 + 60 + 60}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SamsungA12MotionComic"
        component={SamsungA12MotionComic}
        durationInFrames={SAMSUNG_A12_COMIC_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
