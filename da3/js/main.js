// DA 3

import "./phaser.js";
import {UI} from "./UI.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

let shared = {};

var map;
var faune;
var pointer;
var treasure;
var rocks;
var doors;
var fullmap;
var mapText;
var digText;
var winText;
var ineedashovel;
var personText;
var mapCollected = false;
var shovelCollected = false;
var foundSpot = false;
var treasureFound = false;
var shovelText = false;

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
		this.load.image('person', 'assets/person.png');
		this.load.image('sand', 'assets/sand.png');
		this.load.image('palmtree', 'assets/palmtree.png');
		this.load.image('exclaimationpt', 'assets/exclaimationpt.png');
		this.load.image('shovel', 'assets/shovel.png');
		this.load.image('door', 'assets/door.png');
		this.load.image('button', 'assets/button.png');
		
		this.load.atlas('faune', 'assets/faune.png', 'assets/faune.json');
		
		this.load.audio('click', 'assets/metalClick.ogg');
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
		// See collision blocks
		const debugGraphics = this.add.graphics().setAlpha(0.7);
		wallsLayer.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		});
		*/
		
		var click = this.sound.add('click', {volume: 0.4});
		
		var sand = this.physics.add.sprite(670, 650, 'sand');
		
		faune = this.physics.add.sprite(150, 300, 'faune', 'walk-down-3.png');
		//faune = this.physics.add.sprite(sand.x, sand.y, 'faune', 'walk-down-3.png'); // LVL 2 LOCATION
		faune.body.setSize(faune.width*0.4, faune.height*0.5); //hitbox
		faune.setCollideWorldBounds(true); //faune won't go outta bounds
		faune.body.setBounce(0.1);
		
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
		person.body.setSize(person.width*2, person.height); //hitbox
		this.add.image(200, 290, 'person');
		var exclaimationpt = this.physics.add.sprite(200, 265, 'exclaimationpt');
		
		var map = this.physics.add.sprite(160, 20, 'map');
		map.body.setSize(map.width*0.7, map.height*0.7); //map hitbox
		
		var shovel = this.physics.add.sprite(770, 30, 'shovel');
		
		var button = this.physics.add.sprite(764, 158, 'button');
		
		var palmtrees = this.physics.add.group();
		var palmtree = palmtrees.create(700, 600, 'palmtree');
		palmtree.body.immovable = true;
		palmtree.body.setSize(palmtree.width*0.2, palmtree.height*0.7); //hitbox
		
		treasure = this.physics.add.sprite(sand.x, sand.y, 'chest');
		treasure.disableBody(true, true);
		
		// ROCKS
		rocks = this.physics.add.group();
		var rockSize = 32;
		var startpt = 100;
		setRocks();
		

		
		// walls
		var walls = this.physics.add.group();
		startpt = 100
		var wall = walls.create(startpt+rockSize*2, startpt+rockSize*2, 'wall');
		
		var wall2 = walls.create(604, 94, 'wall');
		var wall3 = walls.create(668, 94, 'wall');
		var wall4 = walls.create(668, 30, 'wall');
		var wall5 = walls.create(700, 62, 'wall');
		var wall6 = walls.create(668, 158, 'wall');
		var wall7 = walls.create(604, 126, 'wall');
		var wall8 = walls.create(732, 158, 'wall');
		
		walls.children.iterate(function (child) {
			//child.body.drag.setTo(200);
			//child.setCollideWorldBounds(true);
			//child.mass = 10;
			child.body.immovable = true;
		});
		
		var doors = this.physics.add.group();
		var door = doors.create(732, 62, 'door');
		var door = doors.create(764, 62, 'door');
		
		doors.children.iterate(function (child) {
			child.body.immovable = true;
		});
		
		mapText = "Press 'M' to open map\nand 'X' to close.";
		digText = "Press 'F' to dig.";
		personText = "Congratulations!\nYou found the buried treasure!";
		ineedashovel = this.add.text(sand.x-60, sand.y+20, "I need a shovel.", {font: '18px monospace', fill: '#000'});
		ineedashovel.setVisible(false);
		this.add.text(400, 8, "Press 'R' to reset rocks", {font: '18px monospace', fill: '#000'});
		
		// COLLISIONS
		this.physics.add.collider(faune, wallsLayer);
		this.physics.add.collider(faune, lakeLayer);
		this.physics.add.collider(rocks, faune);
		this.physics.add.collider(rocks);
		this.physics.add.collider(rocks, wallsLayer);
		this.physics.add.collider(faune, walls);
		this.physics.add.collider(rocks, walls);
		this.physics.add.collider(faune, palmtree);
		this.physics.add.collider(faune, doors);
		this.physics.add.collider(rocks, doors);
		
		this.physics.add.overlap(faune, map, collectMap, null, this);
		this.physics.add.overlap(faune, shovel, collectShovel, null, this);
		this.physics.add.overlap(faune, sand, dig, null, this);
		this.physics.add.overlap(faune, person, talk, null, this);
		this.physics.add.overlap(rocks, button, openDoor, null, this);
		
		/* Keys that user can press */
		keys = this.input.keyboard.addKeys("W,A,S,D,M,X,F,R,space");
		
		/* Called when Faune picks up the map */
		function collectMap(faune, map) {
			map.disableBody(true, true);
			mapCollected = true;
			mapText = this.add.text(faune.x-100, faune.y, mapText, {font: '18px monospace', fill: '#000'});
			//if (personText === null) { return; }
			//personText.destroy();
		}
		
		function collectShovel(faune, shovel) {
			shovel.disableBody(true, true);
			shovelCollected = true;
			this.events.emit('addScore');
			ineedashovel.setVisible(false);
		}
		
		/* Called when Faune walks over the sand spot */
		function dig(faune, sand) {
			if (shovelText === false && shovelCollected === false) {
				ineedashovel.setVisible(true);
				shovelText = true;
			}
			if (shovelCollected === false) {
				return; 
			}
			sand.disableBody(true, true);
			foundSpot = true;
			digText = this.add.text(faune.x-200, faune.y, digText, {font: '18px monospace', fill: '#000'});
		}
		
		function talk(faune, person) {
			person.disableBody(true, true);
			personText = this.add.text(faune.x-100, faune.y, "Hey, I heard that there's\na pirate's treasure map inside.", {font: '16px monospace', fill: '#000'});
			exclaimationpt.disableBody(true, true);
		}
		
		function openDoor(rock, button) {
			click.play();
			rock.disableBody(true, true);
			doors.children.iterate(function (child) {
				child.disableBody(true, true);
			});
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
			this.events.emit('openMap');
			mapText.destroy();
		}
		else if (keys.X.isDown) {
			this.events.emit('closeMap');
		}
		
		if (keys.F.isDown) {
			if (foundSpot === false || treasureFound === true || shovelCollected === false) { return; }
			treasureFound = true;
			digText.destroy();
			treasure.setVisible(true);
			winText = this.add.text(faune.x-200, faune.y+40, "Congratulations!\nYou found the buried treasure!", {font: '18px monospace', fill: '#000'});
		}
		
		if (keys.space.isDown) {
			personText.destroy();
		}
		
		if (keys.R.isDown) {
			rocks.clear(true);
			setRocks();
			if (mapCollected === false) {
				faune.setX(150);
				faune.setY(300);
			}
			else {
				faune.setX(500);
				faune.setY(94);
			}
		}
	}
}

	function setRocks() {
		var startpt = 100;
		var rockSize = 32;
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
		
		var rock12 = rocks.create(700, 30, 'rock');
		var rock13 = rocks.create(636, 94, 'rock');
		var rock14 = rocks.create(540, 94, 'rock');
		var rock15 = rocks.create(540, 62, 'rock');
		var rock16 = rocks.create(572, 62, 'rock');
		var rock17 = rocks.create(668, 62, 'rock');
		var rock18 = rocks.create(604, 158, 'rock');
		var rock19 = rocks.create(572, 126, 'rock');
		var rock20 = rocks.create(732, 126, 'rock');
		
		rocks.children.iterate(function (child) {
			child.body.drag.setTo(200);
			child.setCollideWorldBounds(true);
			child.mass = 10;
			child.setBounce(0.1);
		});
		
	}

class SceneB extends Phaser.Scene {

    constructor() {
        super({ key: 'UIScene', active: true });

    }
	
	preload() {
		this.load.image('shovelUI', 'assets/shovel.png');
		this.load.image('fullmap', 'assets/fullmap.png');
	}
	
    create ()
    {
		let shovelUI = this.add.image(382, 46, 'shovelUI');
		shovelUI.setVisible(false);
		let fullmap = this.add.image(200, 130, 'fullmap');
		fullmap.setVisible(false);

		let ourGame = this.scene.get('MyScene');

        //  Listen for events from it
        ourGame.events.on('addScore', function () {
			shovelUI.setVisible(true);
        }, this);
		
		ourGame.events.on('openMap', function () {
			fullmap.setVisible(true);
        }, this);
		
		ourGame.events.on('closeMap', function() {
			fullmap.setVisible(false);
		}, this);
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 400,
    height: 250,
    scene: [ MyScene, UI, SceneB ],
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
