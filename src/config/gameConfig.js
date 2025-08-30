import { GAME_SIZE, BASE_SPEED } from "./constants";
import GameScene from "../scenes/GameScene";

const gameCanvas = document.querySelector("#gameCanvas");

export default {
  type: Phaser.WEBGL,
  width: GAME_SIZE.width,
  height: GAME_SIZE.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: BASE_SPEED },
      debug: false,
    },
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
  scene: [GameScene],
};
