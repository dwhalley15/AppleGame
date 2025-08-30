export default class ControlsManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.isDragging = false;
    this.dragTargetX = player.x;
    this.dragOffsetX = 0;

    // Keyboard
    this.cursor = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Pointer
    this.initPointerControls();
  }

  initPointerControls() {
    this.activePointerId = null;

    this.scene.input.on("pointerdown", (pointer) => {
      const bounds = new Phaser.Geom.Rectangle(
        this.player.x,
        this.player.y,
        this.player.displayWidth,
        this.player.displayHeight
      );

      if (bounds.contains(pointer.x, pointer.y)) {
        this.isDragging = true;
        this.activePointerId = pointer.id;
        this.dragOffsetX = pointer.x - this.player.x;
      }
    });

    this.scene.input.on("pointermove", (pointer) => {
      if (this.isDragging && pointer.id === this.activePointerId) {
        this.dragTargetX = Phaser.Math.Clamp(
          pointer.x - this.dragOffsetX,
          0,
          this.scene.sys.game.config.width - this.player.displayWidth
        );
      }
    });

    this.scene.input.on("pointerup", (pointer) => {
      if (pointer.id === this.activePointerId) {
        this.isDragging = false;
        this.activePointerId = null;
      }
    });
    this.scene.input.on("pointerout", () => {
      this.isDragging = false;
    });
    this.scene.input.on("pointercancel", () => {
      this.isDragging = false;
    });
  }

  update() {
    if (this.isDragging) {
      const lerpSpeed = 0.2;
      this.player.x = Phaser.Math.Linear(
        this.player.x,
        this.dragTargetX,
        lerpSpeed
      );
      this.player.stop();
    } else {
      const leftPressed = this.cursor.left.isDown || this.keys.left.isDown;
      const rightPressed = this.cursor.right.isDown || this.keys.right.isDown;

      if (leftPressed) this.player.moveLeft();
      else if (rightPressed) this.player.moveRight();
      else this.player.stop();
    }
  }
}
