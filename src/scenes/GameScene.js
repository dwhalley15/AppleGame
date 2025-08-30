import Player from "../objects/Player";
import Apple from "../objects/Apple";
import ScoreManager from "../managers/ScoreManager";
import DifficultyManager from "../managers/DifficultyManager";
import SoundManager from "../managers/SoundManager";
import EffectsManager from "../managers/EffectsManager";
import ControlsManager from "../managers/ControlsManager";
import UIManager from "../managers/UIManager";
import { GAME_SIZE } from "../config/constants";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
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
    this.isReady = false;

    // Pause immediately until "Start" is clicked
    this.time.delayedCall(0, () => {
      this.scene.pause();
      this.isReady = true;
    });

    // Background
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "bg"
    );
    const scaleX = this.scale.width / bg.width;
    const scaleY = this.scale.height / bg.height;
    bg.setScale(Math.max(scaleX, scaleY));

    // Managers
    this.soundManager = new SoundManager(this);
    this.scoreManager = new ScoreManager(this);
    this.difficultyManager = new DifficultyManager();

    // Player + Apple
    this.player = new Player(this, GAME_SIZE.width / 2, GAME_SIZE.height - 200);
    this.apple = new Apple(this, this.difficultyManager);

    //Effects
    this.effectsManager = new EffectsManager(this);

    // Collision
    this.physics.add.overlap(
      this.player,
      this.apple,
      this.handleCatch,
      null,
      this
    );

    //Controls
    this.controlsManager = new ControlsManager(this, this.player);

    // UI buttons
    this.uiManager = new UIManager(this);
  }

  update() {
    // Respawn apple if it falls past bottom
    if (this.apple.y >= GAME_SIZE.height) {
      this.apple.respawn(GAME_SIZE.width);
    }

    this.controlsManager.update();
  }

  handleCatch() {
    const { x, y } = this.player.getCenter();
    this.effectsManager.playAppleSplat(x, y);
    if (this.apple.isRotten) {
      this.soundManager.playFail();
      this.difficultyManager.reset();

      if (this.scoreManager.loseLife()) {
        this.gameOver();
        return;
      }
    } else {
      this.soundManager.playSplat();
      this.scoreManager.addPoint();

      if (this.scoreManager.score > 0 && this.scoreManager.score % 10 === 0) {
        this.difficultyManager.increase();
      }

      if (this.scoreManager.score % 100 === 0) {
        this.scoreManager.gainLife();
        this.soundManager.playExtra();
      }
    }

    this.apple.respawn(GAME_SIZE.width);
  }

  gameOver() {
    this.sys.game.destroy(true);
    this.uiManager.showGameOver(this.scoreManager.score);
  }
}
