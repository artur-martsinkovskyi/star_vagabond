import "phaser";
import { GameScene } from "../scenes/gameScene";

export const MAX_HEALTH = 5;

export class Player extends Phaser.GameObjects.Image {
  private ownHealth: number;

  public get health(): number {
    return this.ownHealth;
  }

  public set health(value: number) {
    if (value === this.ownHealth) { return; }
    this.ownHealth = value;
    this.scene.events.emit("healthChanged", value, this.health);
  }

  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

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
    this.ownHealth = MAX_HEALTH;

    const particles = this.scene.add.particles("green");
    const player = this;

    const particleColl = {
      contains(x, y) {
        (player.scene as GameScene).asteroids.getChildren().forEach((asteroid: Phaser.GameObjects.Sprite) => {
          const hit = (asteroid.body as Phaser.Physics.Arcade.Body).hitTest(x, y);

          if (hit) { (player.scene as GameScene).destroyAsteroid(player, asteroid); }

          return hit;
        });
      },
    };

    this.emitter = particles.createEmitter({
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
    this.emitter.startFollow(this);
    this.scene.physics.add.collider(this, (this.scene as GameScene).atmosphereLimit);
  }
}
