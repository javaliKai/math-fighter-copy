import Phaser from 'phaser';

export default class MathFighterScene extends Phaser.Scene {
  constructor() {
    super('math-fighter-scene');
  }
  init() {
    // Game orientation
    this.gameHalfWidth = this.scale.width * 0.5;
    this.gameHalfHeight = this.scale.height * 0.5;

    // Sprites
    this.player = undefined;
    this.enemy = undefined;
    this.slash = undefined;
  }
  preload() {
    this.load.image('background', 'images/bg_layer1.png');
    this.load.image('fight-bg', 'images/fight-bg.png');
    this.load.image('tile', 'images/tile.png');
    this.load.spritesheet('player', 'images/warrior1.png', {
      frameWidth: 80,
      frameHeight: 80,
    });
    this.load.spritesheet('enemy', 'images/warrior2.png', {
      frameWidth: 80,
      frameHeight: 80,
    });
    this.load.spritesheet('numbers', 'images/numbers.png', {
      frameWidth: 131,
      frameHeight: 71.25,
    });
    this.load.spritesheet('slash', 'images/slash.png', {
      frameWidth: 42,
      frameHeight: 88,
    });
  }
  create() {
    // Setting up background scene
    this.add.image(240, 320, 'background');
    const fight_bg = this.add.image(240, 160, 'fight-bg');

    // Creating tile (floor)
    const tile = this.physics.add.staticImage(
      240,
      fight_bg.height - 40,
      'tile'
    );

    // Adding player sprite
    this.player = this.physics.add
      .sprite(this.gameHalfWidth - 150, this.gameHalfHeight - 200, 'player')
      .setBounce(0.2)
      // setOffset will change the x & y relative to the object box
      // used this because I can't move the player further bcs of the collider
      .setOffset(-20, -10);

    // Make the player stand above the tile
    this.physics.add.collider(this.player, tile);

    // Adding the enemy sprite
    this.enemy = this.physics.add
      .sprite(this.gameHalfWidth + 150, this.gameHalfHeight - 200, 'enemy')
      .setBounce(0.2)
      .setOffset(20, -8)
      .setFlipX(true);

    // Make the enemy stand above the tile
    this.physics.add.collider(this.enemy, tile);

    // Slash effect
    this.slash = this.physics.add
      .sprite(240, 60, 'slash')
      .setActive(false)
      .setVisible(false)
      .setGravityY(-500)
      .setOffset(0, -10)
      .setDepth(1)
      .setCollideWorldBounds(true);
  }
  update() {}

  createAnimation() {
    // Player animation
    this.anims.create({
      key: 'player-standby',
      frames: this.anims.generateFrameNumbers('player', {
        start: 15,
        end: 19,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-attack',
      frames: this.anims.generateFrameNumbers('player', {
        start: 10,
        end: 14,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'player-hit',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 9,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'player-die',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });

    // Lanjutin untuk buat animasi enemy sendiri yha (hal 156)😀
  }
}
