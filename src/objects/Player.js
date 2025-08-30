export default class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "basket");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 0);
    this.setScale(0.15);
    this.setImmovable(true);
    this.body.setAllowGravity(false);
    this.setCollideWorldBounds(true);

    this.speed = 350;

    this.setSize(500, 15);
    this.setOffset((this.width - 500) / 2, (this.height - 15) / 2);
  }

  moveLeft() {
    this.setVelocityX(-this.speed);
  }

  moveRight() {
    this.setVelocityX(this.speed);
  }

  stop() {
    this.setVelocityX(0);
  }
}
