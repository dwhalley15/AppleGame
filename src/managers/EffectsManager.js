export default class EffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.emitter = scene.add.particles(0, 0, "apple-splat", {
      speed: 100,
      gravityY: 100,
      scale: 0.04,
      lifespan: 500,
      emitting: false,
    });
    this.emitter.setDepth(2);
  }

  playAppleSplat(x, y) {
    this.emitter.explode(10, x, y - 10);
  }
}
