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

    // Game states
    this.startGame = false;
    this.questionText = undefined;
    this.resultText = undefined;

    // Game buttons
    this.button1 = undefined;
    this.button2 = undefined;
    this.button3 = undefined;
    this.button4 = undefined;
    this.button5 = undefined;
    this.button6 = undefined;
    this.button7 = undefined;
    this.button8 = undefined;
    this.button9 = undefined;
    this.button0 = undefined;
    this.buttonDel = undefined;
    this.buttonOk = undefined;

    // Number inputs
    this.numberArray = [];
    this.number = undefined;

    // Result text
    this.resultText = undefined;

    // Question
    this.question = [];
    this.questionText = undefined;

    // Answer
    this.correctAnswer = undefined;

    // Animation for sprites
    this.playerAttack = false;
    this.enemyAttack = false;
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
    this.load.image('start-btn', 'images/start_button.png');
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

    // Call createAnimation() method
    this.createAnimation();

    // Adding start button
    let start_button = this.add
      .image(this.gameHalfWidth, this.gameHalfHeight + 181, 'start-btn')
      .setInteractive();

    // Adding event handler to start_button
    start_button.on(
      'pointerdown',
      () => {
        this.gameStart();
        // Remove start button once it's clicked
        start_button.destroy();
      },
      this
    );

    // When enemy's slash hits player
    this.physics.add.overlap(
      this.slash,
      this.player,
      this.spriteHit,
      null,
      this
    );

    // When player's slash hits enemy
    this.physics.add.overlap(
      this.slash,
      this.enemy,
      this.spriteHit,
      null,
      this
    );
  }
  update(time) {
    // Animation when the answer is true (player attacks enemy)
    if (this.correctAnswer === true && !this.playerAttack) {
      this.player.anims.play('player-attack', true);
      this.time.delayedCall(500, () => {
        this.createSlash(this.player.x + 60, this.player.y, 4, 600);
      });
      this.playerAttack = true;
    }

    // Animation when idle
    if (this.correctAnswer === undefined) {
      this.player.anims.play('player-standby', true);
      this.enemy.anims.play('enemy-standby', true);
    }

    // Animation when the answer is wrong (enemy attacks player)
    if (this.correctAnswer === false && !this.enemyAttack) {
      this.enemy.anims.play('enemy-attack', true);
      this.time.delayedCall(500, () => {
        this.createSlash(this.enemy.x - 60, this.enemy.y, 2, -600, true);
      });
      this.enemyAttack = true;
    }
  }

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
    // Enemy animation
    this.anims.create({
      key: 'enemy-standby',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 15,
        end: 19,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'enemy-attack',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 10,
        end: 14,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'enemy-hit',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 5,
        end: 9,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'enemy-die',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });
  }

  gameStart() {
    // Set startGame state to true
    this.startGame = true;

    // Run player & enemy standby animation
    this.player.anims.play('player-standby', true);
    this.enemy.anims.play('enemy-standby', true);

    // Add the result & question display
    this.resultText = this.add.text(this.gameHalfWidth, 200, '0', {
      fontSize: '32px',
      // @ts-ignore
      fill: '#000',
    });

    this.questionText = this.add.text(this.gameHalfWidth, 100, '0', {
      fontSize: '32px',
      // @ts-ignore
      fill: '#000',
    });

    // Create buttons
    this.createButtons();

    // Event listener for displaying number input
    this.input.on('gameobjectdown', this.addNumber, this);

    // Generate the question
    this.generateQuestion();
  }

  createButtons() {
    const startPosY = this.scale.height - 246;
    const widthDiff = 131; // margin-left and right
    const heightDiff = 71.25; // margin-top

    // Center buttons
    this.button2 = this.add
      .image(this.gameHalfWidth, startPosY, 'numbers', 1)
      .setInteractive()
      .setData('value', 2);

    this.button5 = this.add
      .image(this.gameHalfWidth, this.button2.y + heightDiff, 'numbers', 4)
      .setInteractive()
      .setData('value', 5);

    this.button8 = this.add
      .image(this.gameHalfWidth, this.button5.y + heightDiff, 'numbers', 7)
      .setInteractive()
      .setData('value', 8);

    this.button0 = this.add
      .image(this.gameHalfWidth, this.button8.y + heightDiff, 'numbers', 10)
      .setInteractive()
      .setData('value', 0);

    // Left buttons
    this.button1 = this.add
      .image(this.button2.x - widthDiff, startPosY, 'numbers', 0)
      .setInteractive()
      .setData('value', 1);

    this.button4 = this.add
      .image(
        this.button5.x - widthDiff,
        this.button1.y + heightDiff,
        'numbers',
        3
      )
      .setInteractive()
      .setData('value', 4);

    this.button7 = this.add
      .image(
        this.button8.x - widthDiff,
        this.button4.y + heightDiff,
        'numbers',
        6
      )
      .setInteractive()
      .setData('value', 7);

    this.buttonDel = this.add
      .image(
        this.button0.x - widthDiff,
        this.button7.y + heightDiff,
        'numbers',
        9
      )
      .setInteractive()
      .setData('value', 'del');

    // Right buttons
    this.button3 = this.add
      .image(this.button2.x + widthDiff, startPosY, 'numbers', 2)
      .setInteractive()
      .setData('value', 3);

    this.button6 = this.add
      .image(
        this.button5.x + widthDiff,
        this.button3.y + heightDiff,
        'numbers',
        5
      )
      .setInteractive()
      .setData('value', 6);

    this.button9 = this.add
      .image(
        this.button8.x + widthDiff,
        this.button6.y + heightDiff,
        'numbers',
        8
      )
      .setInteractive()
      .setData('value', 9);

    this.buttonOk = this.add
      .image(
        this.button0.x + widthDiff,
        this.button9.y + heightDiff,
        'numbers',
        11
      )
      .setInteractive()
      .setData('value', 'ok');
  }

  addNumber(pointer, object, event) {
    let value = object.getData('value');

    // When 'DEL' and 'OK' button is pressed
    if (isNaN(value)) {
      if (value == 'del') {
        this.numberArray.pop();
        if (this.numberArray.length < 1) {
          // Insert 0 when the numberArray is empty after deletion
          this.numberArray[0] = 0;
        }
      }

      if (value == 'ok') {
        this.checkAnswer();
        this.numberArray = [];
        this.numberArray[0] = 0; // reset input
      }
    }
    // When number button is pressed
    else {
      if (this.numberArray.length == 1 && this.numberArray[0] == 0) {
        this.numberArray[0] = value;
      } else {
        if (this.numberArray.length < 10) {
          this.numberArray.push(value);
        }
      }
    }

    // Join the whole number array as a string
    this.number = parseInt(this.numberArray.join(''));

    // Display the number as text
    // @ts-ignore
    this.resultText.setText(this.number);
    const textHalfWidth = this.resultText.width * 0.6;
    this.resultText.setX(this.gameHalfWidth - textHalfWidth);
    event.stopPropagation(); // propagation = bubbling up to parent elements or capturing down to child elements
  }

  getOperator() {
    const operator = ['+', '-', 'x', ':'];
    return operator[Phaser.Math.Between(0, 3)];
  }

  generateQuestion() {
    // Generate random numbers
    let numberA = Phaser.Math.Between(0, 50);
    let numberB = Phaser.Math.Between(0, 50);

    // Generate a random operator
    let operator = this.getOperator();

    // Question display
    if (operator === '+') {
      this.question[0] = `${numberA} + ${numberB}`; // the question
      this.question[1] = numberA + numberB; // the answer
    }
    if (operator === 'x') {
      this.question[0] = `${numberA} x ${numberB}`;
      this.question[1] = numberA * numberB;
    }
    if (operator === '-') {
      if (numberB > numberA) {
        this.question[0] = `${numberB} - ${numberA}`;
        this.question[1] = numberB - numberA;
      } else {
        this.question[0] = `${numberA} - ${numberB}`;
        this.question[1] = numberA - numberB;
      }
    }
    if (operator === ':') {
      // In case that the question is divided by 0, generate new numbers
      do {
        numberA = Phaser.Math.Between(0, 50);
        numberB = Phaser.Math.Between(0, 50);
      } while (!Number.isInteger(numberA / numberB));
      this.question[0] = `${numberA} : ${numberB}`;
      this.question[1] = numberA / numberB;
    }

    this.questionText.setText(this.question[0]);
    const textHalfWidth = this.questionText.width * 0.5;
    this.questionText.setX(this.gameHalfWidth - textHalfWidth);
  }

  checkAnswer() {
    if (this.number == this.question[1]) {
      this.correctAnswer = true;
    } else {
      this.correctAnswer = false;
    }
  }

  createSlash(x, y, frame, velocity, flip = false) {
    this.slash
      .setPosition(x, y)
      .setActive(true)
      .setVisible(true)
      .setFrame(frame)
      .setFlipX(flip)
      .setVelocityX(velocity);
  }

  spriteHit(slash, sprite) {
    slash.x = 0;
    slash.y = 0;
    slash.setActive(false);
    slash.setVisible(false);

    if (sprite.texture.key === 'player') {
      sprite.anims.play('player-hit', true);
    } else {
      sprite.anims.play('enemy-hit', true);
    }

    // Reset back to the initial state
    this.time.delayedCall(500, () => {
      this.playerAttack = false;
      this.enemyAttack = false;
      this.correctAnswer = undefined;
      this.timer = 10;
      this.generateQuestion();
    });
  }
}
