import "phaser";
import { Player } from "../entities/player";

export class GameScene extends Phaser.Scene {
  public scoreText: Phaser.GameObjects.BitmapText;

  public battleMusic: Phaser.Sound.HTML5AudioSound;

  public healthpoints: Phaser.GameObjects.Group;
  public asteroids: Phaser.GameObjects.Group;
  public player: Player;
  public atmosphereLimit: Phaser.Physics.Arcade.StaticGroup;

  public asteroidsDestroyed: number;

  public muteMusicKey: Phaser.Input.Keyboard.Key;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  public preload(): void {
    this.load.image("asteroid", "assets/sprites/asteroid.png");
    this.load.image("ground", "assets/sprites/ground.png");
    this.load.image("ship", "assets/sprites/ship.png");
    this.load.image("healthpoint", "assets/sprites/heart.png");
    this.load.image("green", "assets/particles/green.png");
    this.load.bitmapFont("score_font", "assets/fonts/pixelmania.png", "assets/fonts/pixelmania.fnt");
  }

  public create(): void {
    this.asteroidsDestroyed = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.muteMusicKey = this.input.keyboard.addKey("M");
    this.add.image(400, 300, "sky");

    this.scoreText = this.add.bitmapText(70, 16, "score_font", "0", 32);
    this.scoreText.setLetterSpacing(15);
    this.add.image(35, 32, "asteroid").setScale(0.4);

    this.battleMusic = this.sound.add("battle_theme") as Phaser.Sound.HTML5AudioSound;
    this.battleMusic.setMute(true);
    this.battleMusic.play();

    this.healthpoints = this.add.group({
      key: "healthpoint",
      repeat: 4,
      setXY: { x: 550, y: 32, stepX: 50 },
    } as Phaser.Types.GameObjects.Group.GroupConfig);

    this.healthpoints.getChildren().forEach((el: Phaser.GameObjects.Image) => el.setScale(0.05));
    this.asteroids = this.physics.add.group();

    this.atmosphereLimit = this.physics.add.staticGroup();

    this.atmosphereLimit.create(0, 1100, "ground").setScale(2.1).refreshBody();
    this.player = new Player({
      key: "ship",
      scene: this,
      x: 400,
      y: 810,
    });

    this.physics.add.overlap(this.atmosphereLimit, this.asteroids, this.missAsteroid, null, this);
    this.spawnAsteroids();
  }

  public update(): void {
    if (this.cursors.left.isDown) {
      this.player.goLeft();
    } else if (this.cursors.right.isDown) {
      this.player.goRight();
    } else if (Phaser.Input.Keyboard.JustDown(this.muteMusicKey)) {
      this.battleMusic.setMute(!this.battleMusic.mute);
    } else  {
      this.player.standStill();
    }
  }

  public spawnAsteroids(): void {
    this.spawnAsteroid(Phaser.Math.Between(100, 700), -100);
    this.queueSpawn(Phaser.Math.Between(1000, 1500), this.spawnAsteroids);
  }

  public queueSpawn(time: number, spawner: () => void): void {
    this.time.addEvent({ delay: time, callback: spawner, callbackScope: this });
  }

  public spawnAsteroid(x: number, y: number) {
    const asteroid = this.asteroids.create(x, y, "asteroid");
    asteroid.setScale(0.5);
  }

  public destroyAsteroid(player, asteroid) {
    if (!asteroid.visible) { return; }
    asteroid.disableBody(true, true);

    this.asteroidsDestroyed++;
    this.scoreText.setText(this.asteroidsDestroyed.toString());
  }

  public missAsteroid(atmosphereLimit, asteroid) {
    if (!asteroid.visible) { return; }
    asteroid.disableBody(true, true);

    let alreadyMadeInvisible = false;
    this.healthpoints.children.iterate((healthpoint: Phaser.GameObjects.Sprite) => {
      if (!healthpoint.visible || alreadyMadeInvisible) {
        return;
      } else {
        alreadyMadeInvisible = true;
        healthpoint.visible = false;
      }
    });
    let healthpointsInvisible = 0;
    this.healthpoints.children.iterate((healthpoint: Phaser.GameObjects.Sprite) => {
      if (!healthpoint.visible) {
        healthpointsInvisible++;
      }
    });
    if (healthpointsInvisible === this.healthpoints.getLength()) {
      this.battleMusic.stop();
      this.scene.start("GameOverScene");
    }
  }

}
