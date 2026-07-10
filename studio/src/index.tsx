import React from "react";
import { Composition, registerRoot } from "remotion";
import { SierratechIntro } from "./compositions/SierratechIntro";
import { SierratechHero } from "./compositions/SierratechHero";

// Intro: 5s, 1080x1080 (cuadrado para IG/LinkedIn, se puede reencuadrar)
// Hero: 10s, 1920x1080 (loopable, fondo de la home)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SierratechIntro"
        component={SierratechIntro}
        durationInFrames={150}
        fps={30}
        width={1080}
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
