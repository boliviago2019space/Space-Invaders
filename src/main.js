import spaceinvadersConfig from "../spaceinvaders.config";
import {Engine} from "@babylonjs/core";
import {Environment} from "./Environment";
import State from "./State";
import {DeltaTime} from "./DeltaTime";
import {GameController} from "./GameController";
import {InputController} from "./InputController";
import {Starfield} from "./Starfield";
import {GameAssetsManager} from "./GameAssetsManager";
import {UIText} from "./UIText";
import {MobileInputs} from "./MobileInputs";

// Parche de seguridad previo a ejecutar los modos
if (!spaceinvadersConfig.oldSchoolEffects) {
  spaceinvadersConfig.oldSchoolEffects = { enabled: false };
}

parseSelectedMode();

const canvas = document.querySelector('canvas');
const engine = new Engine(canvas, true);
const environment = new Environment(engine);

const stars = new Starfield(environment.scene);
const deltaTime = new DeltaTime(environment.scene);
const gameAssets = new GameAssetsManager(environment.scene);
const inputController = new InputController(environment.scene);
const UI = new UIText();
const gameController = new GameController(environment, inputController, gameAssets, UI);

let lastRenderTime = 0;
let FPS = 60;
if (spaceinvadersConfig.oldSchoolEffects && spaceinvadersConfig.oldSchoolEffects.enabled) {
  FPS = 18;
}

engine.runRenderLoop(() => {
  if (gameAssets.isComplete) {
    switch (State.state) {
      case "LOADING":
        break;
      case "TITLESCREEN":
        gameController.titleScreen();
        break;
      case "STARTGAME":
        if (Engine.audioEngine && typeof Engine.audioEngine.unlock === 'function') {
          Engine.audioEngine.unlock();
        }
        gameController.startGame();
        break;
      case "NEXTLEVEL":
        gameController.nextLevel();
        break;
      case "GAMELOOP":
        gameController.checkStates();
        break;
      case "ALIENSWIN":
        gameController.aliensWin();
        break;
      case "CLEARLEVEL":
        gameController.clearLevel();
        break;
      case "GAMEOVER":
        gameController.gameOver();
        break;
      default:
        break;
    }

    // Control de FPS para el modo Retro
    let timeNow = Date.now();
    while (timeNow - lastRenderTime < 1000 / FPS) {
      timeNow = Date.now();
    }
    lastRenderTime = timeNow;
    window.scrollTo(0, 0);
    environment.scene.render();
  }
});

window.addEventListener('resize', () => {
  engine.resize();
});

function parseSelectedMode() {
  let mode = parseInt(window.localStorage.getItem('mode') ?? 0);
  document.querySelector("body").classList.add("mode" + mode);
  
  switch (mode) {
    case 0:
      break;
    case 1:
      if (!spaceinvadersConfig.oldSchoolEffects) {
        spaceinvadersConfig.oldSchoolEffects = {};
      }
      spaceinvadersConfig.oldSchoolEffects.enabled = true;
      break;
    case 2:
      spaceinvadersConfig.actionCam = true;
      break;
    default:
      break;
  }
}
