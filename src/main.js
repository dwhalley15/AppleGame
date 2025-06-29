import "./style.css";
import Phaser, { Game, Physics } from "phaser";

const size = {
  width: 500,
  height: 500,
};

const speedDown = 300;

const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");


class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime; 
    this.splatMusic;
    this.bgmMusic;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("apple-splat", "/assets/apple-splat.png");
    this.load.audio("bgm", "/assets/bgm.mp3");
    this.load.audio("splat", "/assets/splat.mp3");
  }

  create() {

    this.scene.pause("scene-game");

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
    this.bgmMusic = this.sound.add("bgm").setLoop(true).setVolume(0.5);
    this.bgmMusic.play();

    // Player
    const basketScale = 0.15;
    this.player = this.physics.add
      .image(0, size.height - 200, "basket")
      .setOrigin(0, 0)
      .setScale(basketScale);
    this.player.setImmovable(true);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    this.setCenteredBody(this.player, 500, 15);

    //Target
    const targetScale = 0.1;
    this.target = this.physics.add
      .image(0, 0, "apple")
      .setOrigin(0, 0)
      .setScale(targetScale);
    this.target.setMaxVelocity(0, speedDown);
    this.setCenteredBody(this.target, 500, 100);

    //Hit detection
    this.physics.add.overlap(
      this.player,
      this.target,
      this.targetHit,
      null,
      this
    );

    //Cursor
    this.cursor = this.input.keyboard.createCursorKeys();

    //Score
    this.textScore = this.add.text(size.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    //Timer
    this.textTime = this.add.text(10, 10, "Remaining Time: 60", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    //Emitter
    this.emitter = this.add.particles(0,0, "apple-splat",{
      speed: 100,
      gravityY : speedDown - 200,
      scale: 0.04, 
      lifespan: 500,
      emitting: false,
    });
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`);
    if (this.target.y >= size.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Phaser.Math.Between(0, size.width - 50);
  }

  targetHit() {
    this.splatMusic.play();
    const { x, y } = this.player.getCenter();
    this.emitter.explode(10, x, y -10);
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points += 1;
    this.textScore.setText(`Score: ${this.points}`);
  }

  setCenteredBody(sprite, bodyWidth, bodyHeight) {
    const offsetX = (sprite.width - bodyWidth) / 2;
    const offsetY = (sprite.height - bodyHeight) / 2;
    sprite.setSize(bodyWidth, bodyHeight);
    sprite.setOffset(offsetX, offsetY);
  }

  gameOver(){
    this.sys.game.destroy(true);
    if(this.points >= 10) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Win!";
    } else{
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Lose!";
    }
    gameEndDiv.style.display = "flex";
  }
}

const config = {
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});
