import "phaser";
import { GameScene } from "../scenes/gameScene";

export class Player extends Phaser.GameObjects.Image {
  public health: number;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.init();
    this.scene.add.existing(this);
  }

  public goLeft(): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-300);
  }

  public goRight(): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(300);
  }

  public standStill(): void {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
  }

  private init(): void {
    this.scene.physics.world.enable(this);
    this.health = 5;

    const particles = this.scene.add.particles("green");
    const self = this;

    const particleColl = {
      contains(x, y) {
        (self.scene as GameScene).asteroids.getChildren().forEach((asteroid: Phaser.GameObjects.Sprite) => {
          const hit = (asteroid.body as Phaser.Physics.Arcade.Body).hitTest(x, y);

          if (hit) { (self.scene as GameScene).destroyAsteroid(self, asteroid); }

          return hit;
        });
      },
    };

    const emitter = particles.createEmitter({
      angle: 270,
      blendMode: "ADD",
      deathZone: { type: "onEnter", source: particleColl },
      gravityY: -300,
      scale: { start: 0.8, end: 0 },
      speed: 500,
    } as Phaser.Types.GameObjects.Particles.ParticleEmitterConfig);

    this.angle = 180;
    this.setScale(0.5);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    emitter.startFollow(this);
    this.scene.physics.add.collider(this, (this.scene as GameScene).atmosphereLimit);
  }
}
