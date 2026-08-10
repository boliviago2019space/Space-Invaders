import spaceinvadersConfig from "../spaceinvaders.config";
import { Color4, ParticleSystem, Texture, Vector3 } from "@babylonjs/core";

export class Starfield {
  constructor(scene) {
    this.scene = scene;
    
    // Obtener la configuración de estrellas con valores por defecto si no existen
    const starConfig = spaceinvadersConfig.starfield || {};
    const starCount = starConfig.numberOfStars || starConfig.numberofStars || 500;

    const starfield = new ParticleSystem("particles", starCount, this.scene);
    starfield.particleTexture = new Texture("./assets/images/star.png", this.scene);
    starfield.emitter = new Vector3(0, 0, 0);
    starfield.minEmitBox = new Vector3(-1000, -1000, 1000);
    starfield.maxEmitBox = new Vector3(1000, 1000, 1000);
    
    starfield.color1 = new Color4(1, 1, 1, 1);
    starfield.color2 = new Color4(1, 1, 1, 1);
    starfield.colorDead = new Color4(0, 0, 0, 0.2);

    starfield.minSize = 1.5;
    starfield.maxSize = 3.0;

    starfield.minLifeTime = 999999;
    starfield.maxLifeTime = 999999;

    starfield.emitRate = starCount;

    starfield.gravity = new Vector3(0, 0, 0);
    starfield.direction1 = new Vector3(0, 0, 0);
    starfield.direction2 = new Vector3(0, 0, 0);

    starfield.start();
  }
}
