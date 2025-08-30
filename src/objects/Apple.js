export default class Apple extends Phaser.Physics.Arcade.Image {
  constructor(scene, difficultyManager) {
    super(scene, 0, 0, "apple");

    this.scene = scene;
    this.difficultyManager = difficultyManager;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.isRotten = false;

    this.body.setAllowGravity(true);
    this.body.setMaxVelocity(0, this.difficultyManager.currentSpeed);

    this.respawn(scene.scale.width);
  }

  respawn(width) {
    const isRotten = Phaser.Math.Between(0, 4) === 0;
    this.isRotten = isRotten;

    this.setTexture(isRotten ? "rotten-apple" : "apple");
    this.setScale(isRotten ? 0.07 : 0.1);

    const halfWidth = this.displayWidth / 2;
    const posX = Phaser.Math.Between(halfWidth, width - halfWidth);
    this.setPosition(posX, 0);

    const bodySize = 70;
    this.setSize(bodySize, bodySize);
    this.setOffset((this.width - bodySize) / 2, (this.height - bodySize) / 2);
    this.body.setMaxVelocity(0, this.difficultyManager.currentSpeed);
  }
}
