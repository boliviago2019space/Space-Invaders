import State from "./State";
import spaceinvadersConfig from "../spaceinvaders.config";

export class GameController {
  constructor(environment, inputController, gameAssets, UI) {
    this.environment = environment;
    this.inputController = inputController;
    this.gameAssets = gameAssets;
    this.UI = UI;

    this.score = 0;
    this.lives = spaceinvadersConfig.game?.initialLives || spaceinvadersConfig.defender?.lives || 3;
    this.level = spaceinvadersConfig.game?.initialLevel || 1;
  }

  titleScreen() {
    // No llamamos a showTitle() porque no existe en UIText.js.
    // El menú principal es manejado directamente por el HTML/DOM.
  }

  startGame() {
    // Cambio inmediato de estado para cortar cualquier bucle de audio
    State.state = "GAMELOOP";

    this.score = 0;
    this.lives = spaceinvadersConfig.game?.initialLives || spaceinvadersConfig.defender?.lives || 3;
    this.level = spaceinvadersConfig.game?.initialLevel || 1;

    // Actualizamos la interfaz con métodos que sí existen
    if (this.UI) {
      if (typeof this.UI.updateScore === 'function') this.UI.updateScore(this.score);
      if (typeof this.UI.updateLives === 'function') this.UI.updateLives(this.lives);
      if (typeof this.UI.updateLevel === 'function') this.UI.updateLevel(this.level);
    }

    try {
      if (this.gameAssets && this.gameAssets.sounds && this.gameAssets.sounds.levelStart) {
        this.gameAssets.sounds.levelStart.play();
      }
    } catch (e) {
      console.warn("Sonido de inicio omitido:", e);
    }

    this.buildLevel();
  }

  nextLevel() {
    State.state = "GAMELOOP";
    this.level++;
    if (this.UI && typeof this.UI.updateLevel === 'function') {
      this.UI.updateLevel(this.level);
    }
    this.buildLevel();
  }

  buildLevel() {
    try {
      if (this.environment) {
        if (typeof this.environment.buildAliensFormation === 'function') {
          this.environment.buildAliensFormation(this.level);
        }
        if (typeof this.environment.buildDefender === 'function') {
          this.environment.buildDefender();
        }
        if (typeof this.environment.buildBunkers === 'function') {
          this.environment.buildBunkers();
        }
      }
    } catch (err) {
      console.error("Error al construir el nivel:", err);
    }
  }

  checkStates() {
    if (this.environment && typeof this.environment.update === 'function') {
      this.environment.update();
    }
  }

  aliensWin() {
    State.state = "GAMEOVER";
  }

  clearLevel() {
    State.state = "NEXTLEVEL";
  }

  gameOver() {
    State.state = "GAMEOVER";
  }
}
