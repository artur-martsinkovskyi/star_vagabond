import "phaser";
import { WelcomeScene } from "./scenes/welcomeScene";
import { GameScene } from "./scenes/gameScene";
import { GameOverScene } from "./scenes/gameOverScene";

var config : Phaser.Types.Core.GameConfig = {
  title: "Star Vagabond",
  type: Phaser.AUTO,
  width: 800,
  height: 900,
  parent: "game",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [WelcomeScene, GameScene, GameOverScene],
  backgroundColor: "#000",
};

export class StarVagabond extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
};

window.onload = () => {
  var game = new StarVagabond(config);
};

