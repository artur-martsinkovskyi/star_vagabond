import "phaser";

export class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.BitmapText;
  promptText: Phaser.GameObjects.BitmapText;

  startGameKey : Phaser.Input.Keyboard.Key;
  muteMusicKey : Phaser.Input.Keyboard.Key;

  menuMusic : Phaser.Sound.HTML5AudioSound;

  constructor() {
    super({
      key: "WelcomeScene"
    });
  }

  preload() : void {
    this.load.image('sky', 'assets/sprites/sky.png');
    this.load.audio('menu_theme', 'assets/music/menu.wav');
    this.load.bitmapFont('title_font', 'assets/fonts/potra.png', 'assets/fonts/potra.fnt');
    this.load.bitmapFont('text_font', 'assets/fonts/vcr.png', 'assets/fonts/vcr.fnt');
  }

  create(): void {
    this.add.image(400, 300, 'sky');

    this.title = this.add.bitmapText(115, 100, 'title_font', 'STAR\nVAGABOND', 100, 1);
    this.promptText = this.add.bitmapText(210, 400, 'text_font', 'Press ENTER to start...', 32, 1);

    this.startGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.muteMusicKey = this.input.keyboard.addKey('M');
    this.menuMusic = this.sound.add('menu_theme') as Phaser.Sound.HTML5AudioSound;
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
