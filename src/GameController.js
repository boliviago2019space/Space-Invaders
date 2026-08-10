import State from "./State";
import spaceinvadersConfig from "../spaceinvaders.config";

export class GameController {
  constructor(environment, inputController, gameAssets, UI) {
    this.environment = environment;
    this.inputController = inputController;
    this.gameAssets = gameAssets;
    this.UI = UI;

    // Inicializar variables de juego de forma segura
    this.score = 0;
    this.lives = spaceinvadersConfig.game?.initialLives || 3;
    this.level = spaceinvadersConfig.game?.initialLevel || 1;
  }

  titleScreen() {
    this.UI.showTitle();
  }

  startGame() {
    // CAMBIO DE ESTADO INMEDIATO: Evita que el bucle renderLoop vuelva a ejecutar startGame()
    State.state = "GAMELOOP";

    this.score = 0;
    this.lives = spaceinvadersConfig.game?.initialLives || 3;
    this.level = spaceinvadersConfig.game?.initialLevel || 1;

    this.UI.updateScore(this.score);
    this.UI.updateLives(this.lives);
    this.UI.updateLevel(this.level);
    this.UI.hideTitle();

    try {
      if (this.gameAssets.sounds.levelStart) {
        this.gameAssets.sounds.levelStart.play();
      }
    } catch (e) {
      console.warn("Error reproduciendo sonido de inicio:", e);
    }

    this.buildLevel();
  }

  nextLevel() {
    State.state = "GAMELOOP";
    this.level++;
    this.UI.updateLevel(this.level);
    this.buildLevel();
  }

  buildLevel() {
    try {
      if (typeof this.environment.buildAliensFormation === 'function') {
        this.environment.buildAliensFormation(this.level);
      }
      if (typeof this.environment.buildDefender === 'function') {
        this.environment.buildDefender();
      }
      if (typeof this.environment.buildBunkers === 'function') {
        this.environment.buildBunkers();
      }
    } catch (err) {
      console.error("Error al construir los elementos del nivel:", err);
    }
  }

  checkStates() {
    // Lógica del bucle principal del juego
    if (typeof this.environment.update === 'function') {
      this.environment.update();
    }
  }

  aliensWin() {
    State.state = "GAMEOVER";
    this.UI.showGameOver();
  }

  clearLevel() {
    State.state = "NEXTLEVEL";
  }

  gameOver() {
    State.state = "GAMEOVER";
    this.UI.showGameOver();
  }
}
