import { MAX_LIVES, TEXT_COLOUR, FONT_FAMILY, FONT_SIZE } from "../config/constants";

export default class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.lives = MAX_LIVES;
    this.textStyle = {
      font: `${FONT_SIZE} ${FONT_FAMILY}`,
      fill: TEXT_COLOUR,
    };

    this.scoreText = scene.add.text(scene.scale.width - 10, 10, "Score: 0", this.textStyle).setOrigin(1, 0);

    this.livesText = scene.add.text(10, 10, "Lives: 3", this.textStyle);
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
