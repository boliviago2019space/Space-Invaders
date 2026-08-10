import {AssetContainer, AssetsManager, SceneLoader, Sound, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders";

export class GameAssetsManager {

  sounds = {};

  constructor(scene) {
    this.isComplete = false;
    this.scene = scene;
    this.assetContainer = new AssetContainer(this.scene);
    this.totalAssetsToLoad = 15;
    this.assetsLoaded = 0;

    // Tiempo límite de seguridad: Si en 4 segundos no ha cargado todo, fuerza el inicio
    setTimeout(() => {
      if (!this.isComplete) {
        console.warn("Forzando el inicio del juego por tiempo límite de carga.");
        this.assetContainer.removeAllFromScene();
        this.isComplete = true;
      }
    }, 4000);

    this.loadSounds();
    this.loadModels();
  }

  loadSounds() {
    const soundList = [
      ["levelStart", "./assets/sounds/level-start-sfx.wav"],
      ["lazer", "./assets/sounds/player-bullet-sfx.wav"],
      ["alienMove", "./assets/sounds/alien-move-sfx.wav"],
      ["alienBullet", "./assets/sounds/alien-bullet-sfx.wav"],
      ["clearLevel", "./assets/sounds/clear-level-sfx.wav"],
      ["motherShipExplosion", "./assets/sounds/mothership-explosion-sfx.wav"],
      ["playerExplosion", "./assets/sounds/player-explosion-sfx.wav"],
      ["alienExplosion", "./assets/sounds/alien-explosion-sfx.wav"],
      ["gameOver", "./assets/sounds/game-over-sfx.wav"],
      ["motherShip", "./assets/sounds/mothership-sfx.wav"]
    ];

    soundList.forEach(([name, path]) => {
      try {
        this.sounds[name] = new Sound(name, path, this.scene, () => {
          this.assetsLoaded++;
          this.checkComplete();
        }, {
          loop: name === "motherShip",
          onError: () => {
            console.warn(`No se pudo cargar el sonido: ${path}`);
            this.assetsLoaded++;
            this.checkComplete();
          }
        });
      } catch (e) {
        this.assetsLoaded++;
        this.checkComplete();
      }
    });
  }

  loadModels() {
    const models = ["Alien_1.glb", "Alien_2.glb", "Alien_3.glb", "Player_1.glb", "MotherShip.glb"];

    models.forEach((file) => {
      this.loadAsset(file)
        .then((assets) => {
          if (assets && assets.meshes && assets.meshes.length > 0) {
            assets.meshes[0].rotation = new Vector3(0, 0, 0);
            if (assets.meshes[1]) assets.meshes[1].position = new Vector3(0, -2000, -2000);
            this.pushToAssetsContainer(assets.meshes[0]);
            if (assets.meshes[1]) this.pushToAssetsContainer(assets.meshes[1]);
          }
          this.assetsLoaded++;
          this.checkComplete();
        })
        .catch((err) => {
          console.warn(`Error cargando modelo ${file}:`, err);
          this.assetsLoaded++;
          this.checkComplete();
        });
    });
  }

  async loadAsset(file) {
    let assets = await SceneLoader.ImportMeshAsync("", "./assets/models/", file, this.scene);
    return assets;
  }

  pushToAssetsContainer(mesh) {
    if (mesh) this.assetContainer.meshes.push(mesh);
  }

  clone(name, newName = null) {
    if (!newName) newName = "id" + Math.floor(Math.random() * 1000000).toString(16);
    let newMesh = null;
    let sourceMesh = this.assetContainer.meshes.filter((mesh) => {
      return mesh.name === name;
    });
    if (sourceMesh.length) {
      newMesh = sourceMesh[0].clone(newName, undefined, undefined);
      newMesh.name = newName;
    }
    return newMesh;
  }

  checkComplete() {
    if (this.assetsLoaded >= this.totalAssetsToLoad) {
      setTimeout(() => {
        this.assetContainer.removeAllFromScene();
        this.isComplete = true;
      }, 1);
    }
  }
}
