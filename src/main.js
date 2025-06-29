import "./style.css";
import Phaser, { Game, Physics } from "phaser";

const size = {
  width: 500,
  height: 500,
};

const gameCanvas = document.querySelector("#gameCanvas");
const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");
const gameRestartBtn = document.querySelector("#gameRestartBtn");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.baseSpeed = 300;
    this.currentSpeed = this.baseSpeed;
    this.player;
    this.cursor;
    this.playerSpeed = this.baseSpeed + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.splatMusic;
    this.bgmMusic;
    this.failMusic;
    this.emitter;
    this.isReady = false;
    this.targetType = "good";
    this.lives = 3;
    this.difficultyLevel = 0;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("apple-splat", "/assets/apple-splat.png");
    this.load.image("rotten-apple", "/assets/rotten-apple.png");
    this.load.audio("bgm", "/assets/bgm.mp3");
    this.load.audio("splat", "/assets/splat.mp3");
    this.load.audio("fail", "/assets/fail.mp3");
    this.load.audio("extra", "/assets/extra.mp3");
  }

  create() {
    this.time.delayedCall(0, () => {
      this.scene.pause();
      this.isReady = true;
    });

    this.physics.world.gravity.y = this.currentSpeed;

    //Background
    const bg = this.add.image(0, 0, "bg");
    bg.setOrigin(0.5, 0.5);
    bg.setPosition(this.scale.width / 2, this.scale.height / 2);
    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;
    const imgWidth = bg.width;
    const imgHeight = bg.height;
    const scaleX = canvasWidth / imgWidth;
    const scaleY = canvasHeight / imgHeight;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    //Music
    this.splatMusic = this.sound.add("splat").setVolume(0.2);
    this.failMusic = this.sound.add("fail").setVolume(0.2);
    this.extraMusic = this.sound.add("extra").setVolume(0.2);
    this.bgmMusic = this.sound.add("bgm").setLoop(true).setVolume(0.5);
    this.bgmMusic.play();
    this.muteToggleBtn = document.querySelector("#muteToggleBtn");
    this.muteToggleBtn.addEventListener("click", () => {
      this.bgmMusic.setMute(!this.bgmMusic.mute);
      this.muteToggleBtn.textContent = this.bgmMusic.mute ? "🔇" : "🔊";
    });

    // Player
    const basketScale = 0.15;
    this.player = this.physics.add
      .image(0, size.height - 200, "basket")
      .setOrigin(0, 0)
      .setScale(basketScale);
    this.textures.get("basket").setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.player.setImmovable(true);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    this.setCenteredBody(this.player, 500, 15);
    this.player.setDepth(1);

    //Target
    const targetScale = 0.1;
    this.target = this.physics.add
      .image(0, 0, "apple")
      .setOrigin(0, 0)
      .setScale(targetScale);
    this.textures.get("apple").setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.textures
      .get("rotten-apple")
      .setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.respawnApple();

    //Hit detection
    this.physics.add.overlap(
      this.player,
      this.target,
      this.targetHit,
      null,
      this
    );

    //Controls
    this.cursor = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    //Score
    this.textScore = this.add.text(size.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    //Emitter
    this.emitter = this.add.particles(0, 0, "apple-splat", {
      speed: 100,
      gravityY: this.baseSpeed - 200,
      scale: 0.04,
      lifespan: 500,
      emitting: false,
    });
    this.emitter.setDepth(2);

    //Lives Counter
    this.textLives = this.add.text(10, 10, "Lives: 3", {
      font: "25px Arial",
      fill: "#000000",
    });
  }

  update() {
    if (this.target.y >= size.height) {
      this.respawnApple();
    }

    const leftPressed = this.cursor.left.isDown || this.keys.left.isDown;
    const rightPressed = this.cursor.right.isDown || this.keys.right.isDown;

    if (leftPressed) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (rightPressed) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Phaser.Math.Between(0, size.width - 50);
  }

  targetHit() {
    const { x, y } = this.player.getCenter();
    this.emitter.explode(10, x, y - 10);

    if (this.targetType === "rotten") {
      this.failMusic.play();
      this.lives -= 1;
      this.textLives.setText(`Lives: ${this.lives}`);
      this.difficultyLevel = 0;
      this.currentSpeed = this.baseSpeed;
      this.physics.world.gravity.y = this.currentSpeed;

      if (this.lives <= 0) {
        this.gameOver();
        return;
      }
    } else {
      this.splatMusic.play();
      this.points += 1;

      if (this.points % 10 === 0) {
        this.increaseDifficulty();
      }

      if (this.points % 100 === 0) {
        const maxLives = 3;
        if (this.lives < maxLives) {
          this.lives += 1;
          this.extraMusic.play();
          this.textLives.setText(`Lives: ${this.lives}`);
        }
      }
    }

    this.textScore.setText(`Score: ${this.points}`);
    this.respawnApple();
  }

  respawnApple() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());

    const isRotten = Phaser.Math.Between(0, 4) === 0;
    if (isRotten) {
      this.target.setTexture("rotten-apple");
      this.targetType = "rotten";
      this.target.setScale(0.07);
    } else {
      this.target.setTexture("apple");
      this.target.setScale(0.1);
      this.targetType = "good";
    }

    this.setCenteredBody(this.target, 500, 100);
    this.target.setMaxVelocity(0, this.currentSpeed);
    this.target.setDepth(0);
  }

  increaseDifficulty() {
    if (this.difficultyLevel >= 12) {
      return;
    }
    this.difficultyLevel += 1;
    this.currentSpeed = this.baseSpeed + this.difficultyLevel * 50;

    this.physics.world.gravity.y = this.currentSpeed;

    console.log(
      `Increased difficulty to level ${this.difficultyLevel}, speed: ${this.currentSpeed}`
    );
  }

  setCenteredBody(sprite, bodyWidth, bodyHeight) {
    const offsetX = (sprite.width - bodyWidth) / 2;
    const offsetY = (sprite.height - bodyHeight) / 2;
    sprite.setSize(bodyWidth, bodyHeight);
    sprite.setOffset(offsetX, offsetY);
  }

  gameOver() {
    this.sys.game.destroy(true);
    gameEndScoreSpan.textContent = this.points;
    gameEndDiv.style.display = "flex";
  }
}

const baseSpeed = 300;

const config = {
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  render: {
    pixelArt: false,
    antialias: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: baseSpeed },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  const scene = game.scene.getScene("scene-game");
  if (!scene.isReady) {
    return;
  }
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});

gameRestartBtn.addEventListener("click", () => {
  window.location.reload();
});
