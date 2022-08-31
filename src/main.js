import Phaser from 'phaser';

import HelloWorldScene from './scenes/HelloWorldScene';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
