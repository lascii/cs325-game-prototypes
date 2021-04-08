// GIS 1 DIGITAL ITERATION
import "./phaser.js";
import eventsCenter from './EventsCenter.js';

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
var platforms;
var flag;
var spikes;
var blues;
var reds;
var gameOver = false;
var temp;
var moveSpeed = 160;
var timedEvent;
var health;
var hit;

var keys;
var camera;

const temperature = {
	COLD: "cold",
	HOT: "hot",
	NEUTRAL: "neutral",
}


class MyScene extends Phaser.Scene {  
    constructor() {
        super();
    }
    
    preload() {
		this.load.image('wall', 'assets/walls.png');
		this.load.image('floor', 'assets/floor.png');
		this.load.image('platform', 'assets/platform.png');
		this.load.image('spike', 'assets/spike.png');
		this.load.image('blue', 'assets/blue.png');
		this.load.image('red', 'assets/red.png');
		this.load.image('flag', 'assets/flag.png');
		
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 } );
		
		this.load.audio('hit', 'assets/hit.ogg');
    }
    
    create() {
		this.physics.world.setBounds(0, 0, 2000, 300);
		background = this.add.image(0, 0, 'wall').setOrigin(0);
		this.add.image(800, 0, 'wall').setOrigin(0);
		this.add.image(1600, 0, 'wall').setOrigin(0);
		
		floor = this.physics.add.staticGroup();
		floor.create(400, 300, 'floor');
		floor.create(1200, 300, 'floor');
		floor.create(2000, 300, 'floor');
		floor.create(400, 100, 'floor');
		floor.create(1200, 100, 'floor');
		floor.create(1500, 100, 'floor');
		
		platforms = this.physics.add.staticGroup();
		platforms.create(1900, 200, 'platform');
		platforms.create(1800, 250, 'platform');
		platforms.create(1870, 120, 'platform');
		platforms.create(2000, 140, 'platform');
		
		spikes = this.physics.add.staticGroup();
		// Floor 1 spikes
		spikes.create(380, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(420, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(600, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(800, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1000, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1300, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1500, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1550, 279, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		// Floor 2 spikes
		spikes.create(100, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(200, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(230, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(500, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(530, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(600, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(800, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(830, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(900, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1100, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1130, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1200, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1230, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1300, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1320, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1500, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1520, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1540, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		spikes.create(1600, 80, 'spike').setScale(.5).setSize(20, 20).setOffset(17, 16);
		
		flag = this.physics.add.sprite(50, 20, 'flag');
		flag.setSize(flag.width, flag.height *.9);
		flag.setScale(0.9);
		
		temp = temperature.NEUTRAL;
		
		blues = this.physics.add.group();
		blues.create(100, 100, 'blue');
		blues.create(500, 100, 'blue');
		blues.create(700, 100, 'blue');
		
		blues.create(150, 50, 'blue');
		blues.create(260, 50, 'blue');
		blues.create(300, 50, 'blue');
		blues.create(400, 50, 'blue');
		blues.create(1650, 50, 'blue');
		blues.create(1850, 50, 'blue');
		
		reds = this.physics.add.group();
		reds.create(20, 100, 'red');
		reds.create(200, 100, 'red');
		reds.create(560, 100, 'red');
		reds.create(1700, 200, 'red');
		
		reds.create(350, 50, 'red');
		reds.create(450, 50, 'red');
		reds.create(1700, 50, 'red');
		reds.create(1800, 50, 'red');
		
		// PLAYER
		player = this.physics.add.sprite(70, 200, 'dude'); // Spawn Point
		//player = this.physics.add.sprite(1500, 50, 'dude'); // Testing
		player.setSize(player.width*.6, player.height);
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
		camera = this.cameras.main.setBounds(0, 0, 2000, 300);
		camera = this.cameras.main.startFollow(player, true);
		
		// KEYS
		keys = this.input.keyboard.addKeys("W,A,S,D,E,space");
		
		// COLLISION
		this.physics.add.collider(player, floor);
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(blues, floor);
		this.physics.add.collider(reds, floor);
		this.physics.add.collider(flag, floor);
		
		// OVERLAP
		this.physics.add.overlap(player, spikes, hitSpike, null, this);
		this.physics.add.overlap(player, blues, collectBlue, null, this);
		this.physics.add.overlap(player, reds, collectRed, null, this);
		this.physics.add.overlap(player, flag, finish, null, this);
		
		function makeCold() {
			temp = temperature.COLD;
			moveSpeed = 90;
			player.setTint(0x00BCFF);
			eventsCenter.emit('makeCold', 0);
			//camera.shake();
		}
		
		function makeHot() {
			temp = temperature.HOT;
			moveSpeed = 200;
			player.setTint(0xff0000);
			eventsCenter.emit('makeHot', 0);
		}
		
		function makeNeutral() {
			temp = temperature.NEUTRAL;
			moveSpeed = 160;
			player.clearTint();
			eventsCenter.emit('makeNeutral', 0);
		}
		
		function collectBlue(player, blue) {
			blue.disableBody(true, true);
			switch (temp) {
				case temperature.NEUTRAL:
				makeCold();
				break;
				case temperature.HOT:
				makeNeutral();
				break;
			}
		}
		
		function collectRed(player, red) {
			red.disableBody(true, true);
			switch (temp) {
				case temperature.NEUTRAL:
				makeHot();
				break;
				case temperature.COLD:
				makeNeutral();
				break;
			}
		}
		
		// Called when the player hits a spike, game over.
		function hitSpike(player, spike) {
			this.physics.pause();
			player.setTint(0xff0000);
			player.anims.play('turn');
			gameOver = true;
			eventsCenter.emit('died', 0);
		}
		
		function finish(player, flag) {
			eventsCenter.emit('win', 0);
		}
		
		timedEvent = this.time.addEvent({
			callback: onEvent,
			callbackScope: this,
			delay: 1000, // 1000 = 1 second
			loop: true
		});
		
		eventsCenter.on('died', died, this);
		
		function died() {
			this.physics.pause();
			player.setTint(0xff0000);
			player.anims.play('turn');
			gameOver = true;
		}
	
    }
    
    update() {		
		// Player Movement
		if (keys.A.isDown) {
			player.setVelocityX(-moveSpeed);
			player.anims.play('left', true);
		}
		else if (keys.D.isDown) {			
			player.setVelocityX(moveSpeed);
			player.anims.play('right', true);
		}
		else {
			player.setVelocityX(0);
			player.anims.play('turn');
		}
		if (keys.space.isDown && player.body.touching.down) {
			player.setVelocityY(-moveSpeed); //jump height
		}
    }
}

function onEvent() {
	if (temp === temperature.HOT) {
		camera.shake();
		eventsCenter.emit('damage', 0);
	}
}

class Inventory extends Phaser.Scene {

    constructor() {
        super({ key: 'Inventory', active: true });

    }
	
	preload() {
		this.load.image('thermometerCold', 'assets/thermometerCold.png');
		this.load.image('thermometerHot', 'assets/thermometerHot.png');
		this.load.image('thermometerNeutral', 'assets/thermometerNeutral.png');
		this.load.image('winbanner', 'assets/winbanner.png');
		this.load.image('died', 'assets/died.png');
		
		this.load.audio('hit', 'assets/hit.ogg');
	}
	
    create ()
    {
		let thermometerCold = this.add.image(395, 37, 'thermometerCold').setScale(0.75);
		let thermometerHot = this.add.image(395, 37, 'thermometerHot').setScale(0.75);
		let thermometerNeutral = this.add.image(395, 37, 'thermometerNeutral').setScale(0.75);
		thermometerCold.setVisible(false);
		thermometerHot.setVisible(false);
		//thermometerNeutral.setVisible(false);
		
		let winbanner = this.add.image(200, 100, 'winbanner');
		winbanner.setVisible(false);
		//this.winText = this.add.text(395, 37, winText, {font: '18px monospace', fill: '#fff'});

		let ourGame = this.scene.get('MyScene');
		
		hit = this.sound.add('hit', {volume: 0.5});
		
        //  Listen for events from it
		eventsCenter.on('makeCold', updateCold, this);
		eventsCenter.on('makeHot', updateHot, this);
		eventsCenter.on('makeNeutral', updateNeutral, this);
		eventsCenter.on('win', win, this);
		eventsCenter.on('damage', damage, this);
		eventsCenter.on('died', died, this);
		
		function updateCold() {
			thermometerCold.setVisible(true);
			thermometerHot.setVisible(false);
			thermometerNeutral.setVisible(false);
		}
		
		function updateHot() {
			thermometerHot.setVisible(true);
			thermometerCold.setVisible(false);
			thermometerNeutral.setVisible(false);
		}
		
		function updateNeutral() {
			thermometerNeutral.setVisible(true);
			thermometerHot.setVisible(false);
			thermometerCold.setVisible(false);
		}
		
		function win() {
			winbanner.setVisible(true);
		}
		
		// HEALTH BAR
		let healthBar = this.add.graphics();
		healthBar.fillStyle(0xF81111, 1);
		healthBar.fillRect(0, 0, 100, 15);
		healthBar.x = 5;
		healthBar.y = 5;
		
		health = 100;
		
		setValue(healthBar, health);
		
		function setValue(bar, percentage) {
			bar.scaleX = percentage/100;
		}
		
		let deadmsg = this.add.image(200, 125, 'died');
		deadmsg.setVisible(false);
		
		function damage() {
			health -= 10;
			if (health === 0) {
				//eventsCenter.emit('died', 0);
				died();
			}
			hit.play();
			setValue(healthBar, health);
		}
		
		function died() {
			deadmsg.setVisible(true);
			temp = temperature.NEUTRAL;
		}
		
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
			debug: false
		},
	},
	scale: { zoom: 2 }
});
