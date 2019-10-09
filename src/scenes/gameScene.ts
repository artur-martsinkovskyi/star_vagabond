import "phaser";

export class GameScene extends Phaser.Scene {
  scoreText : Phaser.GameObjects.BitmapText;

  battleMusic : Phaser.Sound.HTML5AudioSound;

  healthpoints: Phaser.GameObjects.Group;
  asteroids: Phaser.GameObjects.Group;
  player;
  atmosphereLimit : Phaser.Physics.Arcade.StaticGroup;

  asteroidsDestroyed : number;

  muteMusicKey : Phaser.Input.Keyboard.Key;
  cursors : Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image('asteroid', 'assets/sprites/asteroid.png');
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.image('ship', 'assets/sprites/ship.png');
    this.load.image('healthpoint', 'assets/sprites/heart.png');
    this.load.image('green', 'assets/particles/green.png');
    this.load.bitmapFont('score_font', 'assets/fonts/pixelmania.png', 'assets/fonts/pixelmania.fnt');

  }

  create(): void {
    const self = this;

    this.asteroidsDestroyed = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.muteMusicKey = this.input.keyboard.addKey('M');

    this.add.image(400, 300, 'sky');

    this.scoreText = this.add.bitmapText(70, 16, 'score_font', '0', 32);
    this.scoreText.setLetterSpacing(15);
    this.add.image(35, 32, 'asteroid').setScale(0.4);

    this.battleMusic = this.sound.add('battle_theme') as Phaser.Sound.HTML5AudioSound;
    this.battleMusic.play();
    this.battleMusic.setMute(true);

    this.healthpoints = this.add.group({
      key: 'healthpoint',
      repeat: 5,
      setXY: { x: 500, y: 32, stepX: 50 }
    } as Phaser.Types.GameObjects.Group.GroupConfig);

    this.healthpoints.getChildren().forEach((el: Phaser.GameObjects.Image) => el.setScale(0.05));
    this.asteroids = this.physics.add.group();

    let particles = this.add.particles('green');

    const particleColl = {
      contains: function (x, y) {
        self.asteroids.getChildren().forEach(function (asteroid: Phaser.GameObjects.Sprite) {
          let hit = (asteroid.body as Phaser.Physics.Arcade.Body).hitTest(x, y);

          if (hit) { self.destroyAsteroid(self.player, asteroid); }

          return hit;
        });
      }
    };

    const emitter = particles.createEmitter({
      speed: 500,
      angle: 270,
      gravityY: -300,
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      deathZone: { type: 'onEnter', source: particleColl }
    } as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig);

    this.player = this.physics.add.image(400, 810, 'ship');
    this.player.angle = 180;
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
    emitter.startFollow(this.player);

    this.atmosphereLimit = this.physics.add.staticGroup();

    this.atmosphereLimit.create(0, 1100, 'ground').setScale(2.1).refreshBody();
    this.physics.add.collider(this.player, this.atmosphereLimit);
    this.physics.add.overlap(this.atmosphereLimit, this.asteroids, this.missAsteroid, null, this);
    this.spawnAsteroids();
  }

  update (): void {
    if (this.cursors.left.isDown)
    {
      this.player.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.setVelocityX(300);
    } else if (Phaser.Input.Keyboard.JustDown(this.muteMusicKey)) {
      this.battleMusic.setMute(!this.battleMusic.mute);
    }
    else  {
      this.player.setVelocityX(0);
    }
  }

  spawnAsteroids(): void {
    this.spawnAsteroid(Phaser.Math.Between(100, 700), -100);
    this.queueSpawn(Phaser.Math.Between(1000, 1500), this.spawnAsteroids);
  }

  queueSpawn(time: number, spawner: () => void): void {
    this.time.addEvent({ delay: time, callback: spawner, callbackScope: this });
  }

  spawnAsteroid(x: number, y: number) {
    const asteroid = this.asteroids.create(x, y, 'asteroid');
    asteroid.setScale(0.5);
  }

  destroyAsteroid(player, asteroid) {
    if(!asteroid.visible) return;
    asteroid.disableBody(true, true);

    this.asteroidsDestroyed++;
    console.log(this.asteroidsDestroyed)
    this.scoreText.setText(this.asteroidsDestroyed.toString());
  }

  missAsteroid(atmosphereLimit, asteroid) {
    if(!asteroid.visible) return;
    asteroid.disableBody(true, true);

    let alreadyMadeInvisible = false;
    this.healthpoints.children.iterate(function (healthpoint : Phaser.GameObjects.Sprite) {
      if(!healthpoint.visible || alreadyMadeInvisible) {
        return;
      } else {
        alreadyMadeInvisible = true;
        healthpoint.visible = false;
      }
    });
    let healthpoints_invisible = 0;
    this.healthpoints.children.iterate(function (healthpoint : Phaser.GameObjects.Sprite) {
      if(!healthpoint.visible) {
        healthpoints_invisible++;
      }
    });
    if(healthpoints_invisible == this.healthpoints.getLength()) {
      this.scene.start("GameOverScene");
    }
  }

}
