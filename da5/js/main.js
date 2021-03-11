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

var player;
var background;
var floor;
var couch;

var keys;


class MyScene extends Phaser.Scene {  
    constructor() {
        super();
    }
    
    preload() {
		this.load.image('wall', 'assets/walls.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('couch', 'assets/couch.png');
		this.load.image('safe', 'assets/safe.png');
		
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 } );
    }
    
    create() {
		this.physics.world.setBounds(0, 0, 800, 300);
		background = this.add.image(0, 0, 'wall').setOrigin(0);
		
		floor = this.physics.add.staticGroup();
		floor.create(400, 300, 'floor');
		
		couch = this.physics.add.staticImage(100, 272, 'couch');
		
		// PLAYER
		player = this.physics.add.sprite(0, 200, 'dude');
		player.setBounce(0.1);
		player.setCollideWorldBounds(true);
		// PLAYER ANIMATIONS
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
		
		// CAMERA
		this.cameras.main.setBounds(0, 0, 800, 300);
		this.cameras.main.startFollow(player, true);
		
		// KEYS
		keys = this.input.keyboard.addKeys("W,A,S,D,E");
		
		// COLLISION
		this.physics.add.collider(player, floor);
		
		// OVERLAP
		//this.physics.add.overlap(player, couch, onCouch, null, this);
	
    }
    
    update() {		
		// Player Movement
		if (keys.A.isDown) {
			player.setVelocityX(-160);
			player.anims.play('left', true);
		}
		else if (keys.D.isDown) {
			player.setVelocityX(160);
			player.anims.play('right', true);
		}
		else {
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		if (keys.W.isDown && player.body.touching.down) {
			player.setVelocityY(-100); //jump height
		}
		
		if (keys.E.isDown) {
			
		}
    }
}

class Inventory extends Phaser.Scene {

    constructor() {
        super({ key: 'Inventory', active: true });

    }
	
	preload() {
		this.load.image('inventory', 'assets/inventory.png');
		this.load.image('litmatch', 'assets/lit_match.png');
	}
	
    create ()
    {
		let inventory = this.add.image(380, 200, 'inventory');
		
		let litmatch = this.add.image(380, 200, 'litmatch');
		litmatch.setVisible(false);

		let ourGame = this.scene.get('MyScene');
		/*
        //  Listen for events from it
        ourGame.events.on('addScore', function () {
			shovelUI.setVisible(true);
        }, this);
		*/
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 400,
    height: 250,
	scene: [ MyScene, Inventory ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: true
		},
	},
	scale: { zoom: 2 }
});
