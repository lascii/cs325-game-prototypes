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

var map;
var faune;
var cursors;
var pointer;
var treasure;
var rocks;
var fullmap;
var mapText;
var digText;
var winText;
var personText;
var mapCollected = false;
var foundSpot = false;

var keys;

const Direction = 
{
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right"
}

class MyScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'MyScene' });
    }
    
    preload() {
		this.load.image('tiles', 'assets/tilesheet.png');
		this.load.tilemapTiledJSON('oasis', 'assets/oasis.json');
		this.load.image('rock', 'assets/rock.png');
		this.load.image('wall', 'assets/wall.png');
		this.load.image('map', 'assets/map.png');
		this.load.image('chest', 'assets/chest.png');
		this.load.image('fullmap', 'assets/fullmap.png');
		this.load.image('person', 'assets/person.png');
		this.load.image('sand', 'assets/sand.png');
		this.load.image('palmtree', 'assets/palmtree.png');
		
		this.load.atlas('faune', 'assets/faune.png', 'assets/faune.json');
		
		this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    create() {
		this.physics.world.setBounds(0, 0, 800, 800);
		map = this.make.tilemap( { key: 'oasis' });
		var tileset = map.addTilesetImage('oasis', 'tiles')
		
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
		
		faune = this.physics.add.sprite(150, 300, 'faune', 'walk-down-3.png');
		faune.body.setSize(faune.width*0.4, faune.height*0.5); //hitbox
		faune.setCollideWorldBounds(true); //faune won't go outta bounds
		
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
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(faune, true);
		
		var direction = Direction.RIGHT;
		
		var person = this.physics.add.sprite(200, 290, 'person');
		personText = "Hey, I heard that there's a pirate's treasure map inside.";
		this.add.image(200, 290, 'person');
		
		var map = this.physics.add.sprite(160, 20, 'map');
		map.body.setSize(map.width*0.7, map.height*0.7); //map hitbox
		
		var palmtrees = this.physics.add.group();
		var palmtree = palmtrees.create(700, 600, 'palmtree');
		palmtree.body.immovable = true;
		palmtree.body.setSize(palmtree.width*0.2, palmtree.height*0.7); //hitbox
		
		var sand = this.physics.add.sprite(670, 650, 'sand');
		
		treasure = this.physics.add.sprite(sand.x, sand.y, 'chest');
		treasure.disableBody(true, true);
		
		// ROCKS
		rocks = this.physics.add.group();
		var rockSize = 32;
		var startpt = 100;
		var rock = rocks.create(startpt, startpt, 'rock');
		var rock2 = rocks.create(startpt+rockSize*2, startpt, 'rock');
		var rock3 = rocks.create(startpt+rockSize*4, startpt, 'rock');
		var rock4 = rocks.create(startpt, startpt+rockSize, 'rock');
		var rock5 = rocks.create(startpt+rockSize*3, startpt+rockSize, 'rock')
		var rock6 = rocks.create(startpt+rockSize*1, startpt+rockSize*2, 'rock')
		var rock7 = rocks.create(startpt+rockSize*1, startpt+rockSize*3, 'rock')
		var rock8 = rocks.create(startpt+rockSize*3, startpt+rockSize*3, 'rock')		
		var rock9 = rocks.create(startpt+rockSize, startpt+rockSize*4, 'rock')
		var rock10 = rocks.create(startpt+rockSize*2, startpt+rockSize*4, 'rock')
		var rock11 = rocks.create(startpt+rockSize*3, startpt+rockSize*4, 'rock')
		
		rocks.children.iterate(function (child) {
			child.body.drag.setTo(200);
			child.setCollideWorldBounds(true);
			child.mass = 10;
		});
		
		// walls
		var walls = this.physics.add.group();
		startpt = 100
		var wall = walls.create(startpt+rockSize*2, startpt+rockSize*2, 'wall');
		//var wall = walls.create(startpt+rockSize, startpt, 'wall');
		//var wall = walls.create(startpt+rockSize*3, startpt, 'wall');
		//var wall = walls.create(startpt+rockSize*4, startpt, 'wall');
		//var wall = walls.create(startpt+rockSize*5, startpt, 'wall');
		walls.children.iterate(function (child) {
			//child.body.drag.setTo(200);
			//child.setCollideWorldBounds(true);
			//child.mass = 10;
			child.body.immovable = true;
		});
		
		fullmap = this.physics.add.sprite(faune.x+50, faune.y, 'fullmap');
		fullmap.disableBody(true, true);
		mapText = "Press 'M' to open map\nand 'X' to close.";
		digText = "Press 'F' to dig.";
		winText = "\nCongratulations!\nYou found the buried treasure!";
		
		// COLLISIONS
		this.physics.add.collider(faune, wallsLayer);
		this.physics.add.collider(faune, lakeLayer);
		this.physics.add.collider(rocks, faune);
		this.physics.add.collider(rocks);
		this.physics.add.collider(rocks, wallsLayer);
		this.physics.add.collider(faune, walls);
		this.physics.add.collider(rocks, walls);
		this.physics.add.collider(faune, palmtree);
		
		this.physics.add.overlap(faune, map, collectMap, null, this);
		this.physics.add.overlap(faune, sand, dig, null, this);
		this.physics.add.overlap(faune, person, talk, null, this);
		
		/* Keys that user can press */
		keys = this.input.keyboard.addKeys("W,A,S,D,M,X,F,space");
		
		/* Called when Faune picks up the map */
		function collectMap(faune, map) {
			map.disableBody(true, true);
			mapCollected = true;
			mapText = this.add.text(faune.x-100, faune.y, mapText, {font: '18px monospace', fill: '#000'});
		}
		
		/* Called when Faune walks over the sand spot */
		function dig(faune, sand) {
			sand.disableBody(true, true);
			foundSpot = true;
			digText = this.add.text(faune.x-200, faune.y, digText, {font: '18px monospace', fill: '#000'});
		}
		
		function talk(faune, person) {
			person.disableBody(true, true);
			personText = this.add.text(faune.x-100, faune.y, "Hey, I heard that there's\na pirate's treasure map inside.", {font: '16px monospace', fill: '#000'});
		}
    }
	
    update() {
		
		const speed = 100;
		
		if (keys.A.isDown) {
			faune.setVelocity(-speed, 0); // move left
			faune.anims.play('faune-run-side', true); // play walk animation
			faune.flipX= true; // flip the sprite to the left
		}
		else if (keys.D.isDown) {
			faune.setVelocity(speed, 0); // move right
			faune.anims.play('faune-run-side', true); // play walk animatio
			faune.flipX = false; // use the original sprite looking to the right
		}
		else if (keys.W.isDown) {
			faune.setVelocity(0, -speed); // move up
			faune.anims.play('faune-run-up', true);
		}
		else if (keys.S.isDown) {
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
		
		/* Opens and closes map */
		if (keys.M.isDown) {
			if (mapCollected === false) { return; }
			fullmap.setX(faune.x+30);
			fullmap.setY(faune.y);
			fullmap.setVisible(true);
			mapText.destroy();
		}
		else if (keys.X.isDown) {
			fullmap.setVisible(false);
		}
		
		if (keys.F.isDown) {
			if (foundSpot === false) { return; }
			digText.destroy();
			treasure.setVisible(true);
			winText = this.add.text(faune.x-200, faune.y+40, winText, {font: '18px monospace', fill: '#000'});
		}
		
		if (keys.space.isDown) {
			personText.destroy();
		}
	}
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
			debug: true
		},
	},
	scale: {
		zoom: 2
	}
});
