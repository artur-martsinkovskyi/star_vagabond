import "phaser";

export class GameOverScene extends Phaser.Scene {
  public title: Phaser.GameObjects.BitmapText;
  public promptText: Phaser.GameObjects.BitmapText;
  public startGameKey: Phaser.Input.Keyboard.Key;
  public deathSound: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({
      key: "GameOverScene",
    });
  }

  public preload(): void {
    this.load.audio("death_sound", "/assets/sound/death.wav");
  }

  public create(): void {
    this.add.image(400, 300, "sky");

    this.deathSound = this.sound.add("death_sound") as Phaser.Sound.HTML5AudioSound;
    this.deathSound.play();

    this.title = this.add.bitmapText(115, 100, "text_font", "GAME OVER", 100, 1);

    this.promptText = this.add.bitmapText(200, 300, "text_font", "Press ENTER to try\n   again, wanderer...", 32, 1);

    this.startGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  public update(): void {
    if (this.startGameKey.isDown) {
      this.goToGameScene();
    }
  }

  public goToGameScene(): void {
    this.scene.start("GameScene");
  }
}
