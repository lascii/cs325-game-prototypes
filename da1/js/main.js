import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var platforms;
var player;
var cursors;
var stars;
var blueflasks;
var redflasks;
var bombs;
var score = 0;
var scoreText;
var gameOver = false;
	
var instructions = "Use the arrow keys to move.\nCollect the blue flasks. "
	+ "Picking up the red flasks causes a reaction,\ncausing you to lose points. "
	+ "Avoid bombs.\n";

class MyScene extends Phaser.Scene {  
    constructor() {
        super();
    }
    
    preload() {
		this.load.image('sky', 'assets/lab.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('star', 'assets/blueflask.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 } );
		this.load.image('blueflask', 'assets/blueflask.png');
		this.load.image('redflask', 'assets/redflask.png');
    }
    
    create() {		
		this.add.image(0, 0, 'sky').setOrigin(0);
		
		platforms = this.physics.add.staticGroup(); // Creates a Static physics body(can't move)
		platforms.create(400, 568, 'ground').setScale(3).refreshBody(); // Scales the platform image	
		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');
		
		this.instructions = this.add.text(10, 530, instructions, {font: '20px monospace', fill: '#fff'}); // Instructions
	
		player = this.physics.add.sprite(100, 450, 'dude');

		player.setBounce(0.1);
		player.setCollideWorldBounds(true);
		
		this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
		});

		this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
		});

		this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
		});

		cursors = this.input.keyboard.createCursorKeys();
		
		stars = this.physics.add.group({
		key: 'star',
		repeat: 5,
		setXY: { x: getRandomNum(10, 100) , y: 0, stepX: 170 }
		});

		stars.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
		});
		
		redflasks = this.physics.add.group({
		key: 'redflask',
		repeat: 4,
		setXY: { x: getRandomNum(20, 200), y: 0, stepX: getRandomNum(150, 200) }
		});

		redflasks.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
		});
		
		bombs = this.physics.add.group();
		
		scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'} );
		
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(stars, platforms);
		this.physics.add.collider(bombs, platforms);
		this.physics.add.collider(redflasks, platforms);
		
		this.physics.add.overlap(player, stars, collectStar, null, this);
		this.physics.add.overlap(player, redflasks, collectRed, null, this);
		this.physics.add.overlap(player, bombs, hitBomb, null, this);
		
		function getRandomNum(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max-min) + min);
		}
		
		function collectStar(player, star) {
			star.disableBody(true, true);
		
			score += 10;
			scoreText.setText('Score: ' + score);
		
			if (stars.countActive(true)===0) {
				stars.children.iterate(function(child) {
					child.enableBody(true, child.x, 0, true, true);
				});
				redflasks.children.iterate(function(child) {
					child.enableBody(true, child.x, 0, true, true);
				});
		
				createBomb();
			}
		}

		function createBomb() {
			var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
		
			var bomb = bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		}

		function collectRed(player, redflask) {
			redflask.disableBody(true, true);
			score -= 10;
			scoreText.setText('Score: ' + score);
			createBomb();
		}	

		function hitBomb(player, bomb) {
			this.physics.pause();
			player.setTint(0xff0000);
			player.anims.play('turn');
			gameOver = true;
		}	
    }
    
    update() {		
		// Player Movement
		if (cursors.left.isDown) {
			player.setVelocityX(-160);
			player.anims.play('left', true);
		}
		else if (cursors.right.isDown) {
			player.setVelocityX(160);
			player.anims.play('right', true);
		}
		else {
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		if (cursors.up.isDown && player.body.touching.down) {
			player.setVelocityY(-330); //jump height
		}
		else if (cursors.down.isDown && (!player.body.touching.down)) {
			player.setVelocityY(300);
		}
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	},
    scene: MyScene,
    });
