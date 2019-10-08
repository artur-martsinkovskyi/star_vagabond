var width = 800;
var height = 900;

var scoreText;
var asteroidIcon;

var missedText;

var asteroids;
var healthpoints;
var player;
var atmosphereLimit;

var cursors;
var muteMusicKey;
var startGameKey;

var music;
var menuMusic;
var battleMusic;

var gameOver = false
var asteroidsDestroyed = 0;

var isLoadScreen = true;
var title;
var prompt;

var gameStarted = false;

var gameOverTitle;
var gameOverPrompt;

var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/sprites/sky.png');
  this.load.image('asteroid', 'assets/sprites/asteroid.png');
  this.load.image('ground', 'assets/sprites/ground.png');
  this.load.image('ship', 'assets/sprites/ship.png');
  this.load.image('healthpoint', 'assets/sprites/heart.png');
  this.load.image('green', 'assets/particles/green.png');
  this.load.audio('battle_theme', 'assets/music/battle.wav');
  this.load.audio('menu_theme', 'assets/music/menu.wav');
  this.load.bitmapFont('score_font', 'assets/fonts/pixelmania.png', 'assets/fonts/pixelmania.fnt');
  this.load.bitmapFont('title_font', 'assets/fonts/potra.png', 'assets/fonts/potra.fnt');
  this.load.bitmapFont('text_font', 'assets/fonts/vcr.png', 'assets/fonts/vcr.fnt');
}

function create ()
{
  cursors = this.input.keyboard.createCursorKeys();

  this.add.image(400, 300, 'sky');


  menuMusic = this.sound.add('menu_theme');
  battleMusic = this.sound.add('battle_theme');
  music = [menuMusic, battleMusic];
  menuMusic.play();
  menuMusic.setLoop(true);
  battleMusic.setLoop(true);
  muteMusicKey = this.input.keyboard.addKey('M');
  startGameKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  title = this.add.bitmapText(115, 100, 'title_font', 'STAR\nVAGABOND', 100, 1);
  prompt = this.add.bitmapText(210, 400, 'text_font', 'Press ENTER to start...', 32, 1);
  gameOverTitle = this.add.bitmapText(115, 100, 'text_font', 'GAME OVER', 100, 1);
  gameOverTitle.visible = false;
  gameOverPrompt = this.add.bitmapText(200, 300, 'text_font', 'Press ENTER to try\n   again, wanderer...', 32, 1);
  gameOverPrompt.visible = false;
}

function update() {
  if (Phaser.Input.Keyboard.JustDown(muteMusicKey)) {
    music.forEach(function (musicTrack) { musicTrack.setMute(!musicTrack.mute)});
  }
  if(!gameStarted && !isLoadScreen) {
    (initGame.bind(this))();
  }
  if(isLoadScreen) {
    if(startGameKey.isDown) {
      title.visible = false;
      prompt.visible = false;
      gameStarted = false;
      isLoadScreen = false;
      menuMusic.stop();
      battleMusic.play();
      return;
    }
  }
  if(gameOver) {
    gameOverTitle.visible = true;
    gameOverPrompt.visible = true;
    if(startGameKey.isDown) {
      gameOverTitle.visible = false;
      gameOverPrompt.visible = false;
      gameOver = false;
      asteroidsDestroyed = 0;
      scoreText.setText('0');;
      healthpoints.children.iterate(function (healthpoint) {
        healthpoint.visible = true;
      });
      (spawnAsteroids.bind(this))();
      return;
    }

  }
  if(!gameStarted || gameOver) return;
  if (cursors.left.isDown)
  {
    player.setVelocityX(-300);
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(300);
  }
  else  {
    player.setVelocityX(0);
  }
}

function initGame() {
  console.log("STARTED")
  gameStarted = true;

  scoreText = this.add.bitmapText(70, 16, 'score_font', '0', 32);
  scoreText.setLetterSpacing(15);
  asteroidIcon = this.add.image(35, 32, 'asteroid');
  asteroidIcon.setScale(0.4);
  asteroids = this.physics.add.group();

  healthpoints = this.add.group({
    key: 'healthpoint',
    repeat: 5,
    setXY: { x: 500, y: 32, stepX: 50 }
  });
  healthpoints.getChildren().forEach(el => el.setScale(0.05));

  asteroids.getChildren().forEach(el => el.setScale(0.5));

  var particles = this.add.particles('green');

  var particleColl = {
    contains: function (x, y) {
      asteroids.getChildren().forEach(function (asteroid) {
        var hit = asteroid.body.hitTest(x, y);

        if (hit) { destroyAsteroid(player, asteroid); }

        return hit;
      });
    }
  };

  var emitter = particles.createEmitter({
    speed: 500,
    angle: 270,
    gravityY: -300,
    scale: { start: 0.8, end: 0 },
    blendMode: 'ADD',
    deathZone: { type: 'onEnter', source: particleColl }
  });

  player = this.physics.add.image(400, 810, 'ship');
  player.angle = 180;
  player.setScale(0.5);
  player.setCollideWorldBounds(true);
  emitter.startFollow(player);

  atmosphereLimit = this.physics.add.staticGroup();

  atmosphereLimit.create(0, 1100, 'ground').setScale(2.1).refreshBody();

  this.physics.add.collider(player, atmosphereLimit);
  this.physics.add.overlap(atmosphereLimit, asteroids, missAsteroid, null, this);
  (spawnAsteroids.bind(this))();
}

function spawnAsteroids() {
  if (!gameOver) {
    spawnAsteroid(Phaser.Math.Between(100, 700), -100);
    (queueSpawn.bind(this))(Phaser.Math.Between(1000, 1500), spawnAsteroids.bind(this));
  }
}

function queueSpawn(time, spawner) {
  this.time.addEvent({ delay: time, callback: spawner, callbackScope: this });
}

function spawnAsteroid(x, y) {
  var asteroid = asteroids.create(x, y, 'asteroid');
  asteroid.setScale(0.5);
}

function destroyAsteroid(player, asteroid) {
  if(!asteroid.visible) return;
  asteroid.disableBody(true, true);

  asteroidsDestroyed++;
  scoreText.setText(asteroidsDestroyed);
}

function missAsteroid(atmosphereLimit, asteroid) {
  if(!asteroid.visible) return;
  asteroid.disableBody(true, true);

  var alreadyMadeInvisible = false;
  healthpoints.children.iterate(function (healthpoint) {
    if(!healthpoint.visible || alreadyMadeInvisible) {
      return;
    } else {
      alreadyMadeInvisible = true;
      healthpoint.visible = false;
    }
  });
  var healthpoints_invisible = 0;
  healthpoints.children.iterate(function (healthpoint) {
    if(!healthpoint.visible) {
      healthpoints_invisible++;
    }
  });
  if(healthpoints_invisible == healthpoints.getLength()) { // healthpoints length includes containter itself
    gameOver = true;
  }

}
