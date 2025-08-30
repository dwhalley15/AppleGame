export default class UIManager {
  constructor(scene) {
    this.scene = scene;

    this.startDiv = document.querySelector("#gameStartDiv");
    this.startBtn = document.querySelector("#gameStartBtn");
    this.endDiv = document.querySelector("#gameEndDiv");
    this.endScore = document.querySelector("#gameEndScoreSpan");
    this.restartBtn = document.querySelector("#gameRestartBtn");

    this.startBtn.addEventListener("click", () => this.startGame());
    this.restartBtn.addEventListener("click", () => window.location.reload());
  }

  startGame() {
    this.startDiv.style.display = "none";
    this.scene.scene.resume();
  }

  showGameOver(score) {
    this.endScore.textContent = score;
    this.endDiv.style.display = "flex";
  }
}
