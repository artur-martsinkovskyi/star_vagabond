import "phaser";
import { GameOverScene } from "./scenes/gameOverScene";
import { GameScene } from "./scenes/gameScene";
import { WelcomeScene } from "./scenes/welcomeScene";

export class StarVagabond extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  const config: Phaser.Types.Core.GameConfig = {
    backgroundColor: "#000",
    height: 900,
    parent: "game",
    physics: {
      arcade: {
        gravity: { y: 200 },
      },
      default: "arcade",
    },
    scene: [WelcomeScene, GameScene, GameOverScene],
    title: "Star Vagabond",
    type: Phaser.AUTO,
    width: 800,
  };

  const game = new StarVagabond(config);
};
