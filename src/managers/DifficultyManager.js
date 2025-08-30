import { BASE_SPEED, DIFFICULTY_INCREMENT } from "../config/constants";

export default class DifficultyManager {
  constructor() {
    this.level = 0;
    this.currentSpeed = BASE_SPEED;
  }

  increase() {
    if (this.level >= 12) return;

    this.level++;
    this.currentSpeed = BASE_SPEED + this.level * DIFFICULTY_INCREMENT;

    console.log(`Difficulty: ${this.level}, Speed: ${this.currentSpeed}`);
  }

  reset() {
    this.level = 0;
    this.currentSpeed = BASE_SPEED;
  }
}
