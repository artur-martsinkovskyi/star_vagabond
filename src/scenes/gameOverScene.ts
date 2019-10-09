import "phaser";

export class GameOverScene extends Phaser.Scene {
  title: Phaser.GameObjects.BitmapText;
  promptText: Phaser.GameObjects.BitmapText;

  startGameKey : Phaser.Input.Keyboard.Key;
  muteMusicKey : Phaser.Input.Keyboard.Key;

  menuMusic : any;

  constructor() {
    super({
      key: "GameOverScene"
    });
  }

  preload() : void {
    this.load.image('sky', 'assets/sprites/sky.png');
    this.load.audio('menu_theme', 'assets/music/menu.wav');
    this.load.bitmapFont('text_font', 'assets/fonts/vcr.png', 'assets/fonts/vcr.fnt');
  }

  create(): void {
    this.add.image(400, 300, 'sky');

    this.title = this.add.bitmapText(115, 100, 'text_font', 'GAME OVER', 100, 1);

    this.promptText = this.add.bitmapText(200, 300, 'text_font', 'Press ENTER to try\n   again, wanderer...', 32, 1);

    this.startGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.muteMusicKey = this.input.keyboard.addKey('M');
    this.menuMusic = this.sound.add('menu_theme');
    this.menuMusic.play();
    this.menuMusic.setLoop(true);
    this.menuMusic.setMute(true);
  }

  update(): void {
    if(this.startGameKey.isDown) {
      this.scene.start("GameScene");
    } else if (Phaser.Input.Keyboard.JustDown(this.muteMusicKey)) {
     this.menuMusic.setMute(!this.menuMusic.mute);
    }
  }
};
