import "phaser";

export class WelcomeScene extends Phaser.Scene {
  public title: Phaser.GameObjects.BitmapText;
  public promptText: Phaser.GameObjects.BitmapText;

  public startGameKey: Phaser.Input.Keyboard.Key;
  public muteMusicKey: Phaser.Input.Keyboard.Key;

  public menuMusic: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({
      key: "WelcomeScene",
    });
  }

  public preload(): void {
    this.load.image("sky", "assets/sprites/sky.png");

    this.load.audio("menu_theme", "assets/sound/menu.wav");
    this.load.audio("battle_theme", "assets/sound/battle.wav");

    this.load.bitmapFont("title_font", "assets/fonts/potra.png", "assets/fonts/potra.fnt");
    this.load.bitmapFont("text_font", "assets/fonts/vcr.png", "assets/fonts/vcr.fnt");
  }

  public create(): void {
    this.add.image(400, 300, "sky");

    this.title = this.add.bitmapText(115, 100, "title_font", "STAR\nVAGABOND", 100, 1);
    this.promptText = this.add.bitmapText(210, 400, "text_font", "Press ENTER to start...", 32, 1);

    this.startGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.muteMusicKey = this.input.keyboard.addKey("M");
    this.menuMusic = this.sound.add("menu_theme") as Phaser.Sound.HTML5AudioSound;
    this.menuMusic.play();
    this.menuMusic.setLoop(true);
    this.menuMusic.setMute(true);
  }

  public update(): void {
    if (this.startGameKey.isDown) {
      this.goToGameScene();
    } else if (Phaser.Input.Keyboard.JustDown(this.muteMusicKey)) {
     this.menuMusic.setMute(!this.menuMusic.mute);
    }
  }

  public goToGameScene(): void {
    this.menuMusic.stop();
    this.scene.start("GameScene");
  }
}
