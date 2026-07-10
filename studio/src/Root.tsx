import React from "react";
import { Composition, registerRoot } from "remotion";
import { SierratechIntro } from "./compositions/SierratechIntro";
import { SierratechHero } from "./compositions/SierratechHero";

// Intro: 8s, 1920x1080 (cinematic widescreen intro de marca)
// Hero: 10s, 1920x1080 (loopable, fondo de la home)
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
    </>
  );
};

registerRoot(RemotionRoot);
