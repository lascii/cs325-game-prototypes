import "./phaser.js";

//import './FrogAnims.js';

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var map;
var lake;
var faune;
var cursors;
var pointer;
var frogs;
var knives;
var NUM_KNIVES = 2;
var score = 0;
var gameOver = false;
var gameOverText = "Oasis was poisoned. Try again.";
var scoreText;

const Direction = 
{
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right"
}

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
		this.load.image('tiles', 'assets/tilesheet.png');
		this.load.tilemapTiledJSON('oasis', 'assets/oasis.json');
		this.load.image('lake', 'assets/lake.png');
		this.load.image('knife', 'assets/weapon_knife.png');
		
		this.load.atlas('faune', 'assets/faune.png', 'assets/faune.json');
		this.load.atlas('frog', 'assets/frog.png', 'assets/frog.json');
		
		this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    create() {
		this.physics.world.setBounds(0, 0, 480, 480);
		map = this.make.tilemap( { key: 'oasis' });
		var tileset = map.addTilesetImage('oasis', 'tiles')
		
		lake = this.physics.add.staticGroup();
		lake.create(230, 220, 'lake');
		lake.create(230, 260, 'lake');
		lake.create(280, 220, 'lake');
		lake.create(280, 260, 'lake');
		
		map.createStaticLayer('ground', tileset);
		var wallsLayer = map.createStaticLayer('top', tileset);
		wallsLayer.setCollisionByProperty({ collides: true });
		
		var lakeLayer = map.createStaticLayer('lake', tileset);
		lakeLayer.setCollisionByProperty({ collides: true });
		
		/*
		// See collision
		const debugGraphics = this.add.graphics().setAlpha(0.7);
		wallsLayer.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		});
		*/
		
		//scoreText = this.add.text(100, 100, scoreText, {font: '20px monospace', fill: '#000'});
		
		faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
		faune.body.setSize(faune.width*0.5, faune.height*0.8); //hitbox
		faune.setCollideWorldBounds(true); //faune won't go outta bounds
		
		knives = this.physics.add.group();
		knives.createMultiple({ key: 'knife', repeat: 2, visible: false, active: false, setXY: { x: 100, y: 100 } });
	
		this.anims.create({
			key: 'faune-idle-down',
			frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
		});
		this.anims.create({
			key: 'faune-idle-up',
			frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
		});
		this.anims.create({
			key: 'faune-idle-side',
			frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
		});
		
		this.anims.create({
			key: 'faune-run-down',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
			repeat: -1,
			frameRate: 11
		});
		this.anims.create({
			key: 'faune-run-up',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
			repeat: -1,
			frameRate: 11
		});
		this.anims.create({
			key: 'faune-run-side',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
			repeat: -1,
			frameRate: 11
		});
		
		this.physics.add.collider(faune, wallsLayer);
		this.physics.add.collider(faune, lakeLayer);
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(faune, true);
		
		var direction = Direction.RIGHT;
		
		frogs = this.physics.add.group();
		
		var i;
		for (i=0; i<4; i++) {
			createFrog();
		}
		
		this.physics.add.collider(frogs, wallsLayer);
		//this.physics.add.collider(knives, wallsLayer);

		
		this.physics.add.overlap(frogs, knives, hitFrog, null, this);
		this.physics.add.overlap(frogs, lake, poisonedLake, null, this);
		
		cursors = this.input.keyboard.createCursorKeys();
		
		function createFrog() {
			var x = Phaser.Math.Between(0, 1) * 450;
			var y = Phaser.Math.Between(0, 1) * 450;
			var frog = frogs.create(x, y, 'frog');
			frog.setVelocity(Phaser.Math.Between(-50, 50), 20);
			frog.setBounce(1);
			frog.setCollideWorldBounds(true);
		}
		
		function poisonedLake(frogs, lake) {
			this.physics.pause();
			faune.setTint(0xff0000);
			gameOver = true;
			gameOverText = this.add.text(faune.x-100, faune.y-100, gameOverText, {font: '20px monospace', fill: '#000'});
		}
		
		function hitFrog(frog, knife) {
			score += 1;
			knife.setActive(false).setVisible(false);
			frog.disableBody(true, true);
			//scoreText.setText('Score: ' + score);
			
			if (frogs.countActive(true)===0) {
				frogs.children.iterate(function(child) {
					child.enableBody(true, Phaser.Math.Between(0,1)*450, Phaser.Math.Between(0,1)*450, true, true);
					child.setVelocity(Phaser.Math.Between(-50, 50), 20);
				});
				createFrog();
				createFrog();
				createFrog();
			}
		}
    }
	
    update() {
		
		const speed = 100;
		
		if (cursors.left.isDown) {
			faune.setVelocity(-speed, 0); // move left
			faune.anims.play('faune-run-side', true); // play walk animation
			faune.flipX= true; // flip the sprite to the left
		}
		else if (cursors.right.isDown) {
			faune.setVelocity(speed, 0); // move right
			faune.anims.play('faune-run-side', true); // play walk animatio
			faune.flipX = false; // use the original sprite looking to the right
		}
		else if (cursors.up.isDown) {
			faune.setVelocity(0, -speed); // move up
			faune.anims.play('faune-run-up', true);
		}
		else if (cursors.down.isDown) {
			faune.setVelocity(0, speed); // move down
			faune.anims.play('faune-run-down', true);
		}
		else {
			faune.setVelocity(0, 0);
			//const parts = faune.anims.currentAnim.key.split('-');
			//parts[1] = 'idle';
			//faune.play(parts.join('-'));
			faune.anims.play('faune-idle-down', true);
		}
		
		
		pointer = this.input.on('pointerdown', pointer => {
			throwKnife();
		});
	}
}

		function throwKnife() {
			const parts = faune.anims.currentAnim.key.split('-');
			const direction = parts[2];
			const vec = new Phaser.Math.Vector2(0, 0)
			
			switch (direction)
			{
				case 'up':
					vec.y = -1
					break
				case 'down':
					vec.y = 1
					break
				case 'side':
					if (faune.flipX === true) { 
						vec.x = -1 
					}
					else {
						vec.x = 1
					}
					break
			}
			
			
			const angle = vec.angle()
			//var knife = knives.getFirstDead();
			const knife = knives.get(faune.x, faune.y, 'knife').setActive(true).setVisible(true);
			
			if (knife === null | knife === undefined) {
				return;
			}
			
			knife.setCollideWorldBounds(true);
			knife.body.onWorldBounds = true;
			knife.body.world.on('worldbounds', function(body) {
				if (body.gameObject === this) {
					this.setActive(false);
					this.setVisible(false);
				}
			}, knife);
			
			knife.setX(faune.x);
			knife.setY(faune.y);
			
			//knife.getRotation(angle);
			knife.setVelocity(vec.x * 100, vec.y *100);
		}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 400,
    height: 250,
    scene: MyScene,
    physics: { 
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			enableBody: true,
			//debug: true
		},
	},
	scale: {
		zoom: 2
	}
});
