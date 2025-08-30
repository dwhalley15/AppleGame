import { MAX_LIVES } from "../config/constants";

export default class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.lives = MAX_LIVES;

    this.scoreText = scene.add.text(scene.scale.width - 125, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.livesText = scene.add.text(10, 10, "Lives: 3", {
      font: "25px Arial",
      fill: "#000000",
    });
  }

  addPoint() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  loseLife() {
    this.lives--;
    this.livesText.setText(`Lives: ${this.lives}`);
    return this.lives <= 0;
  }

  gainLife() {
    if (this.lives < MAX_LIVES) {
      this.lives++;
      this.livesText.setText(`Lives: ${this.lives}`);
    }
  }
}
