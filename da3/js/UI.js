//import "./phaser.js";

var UImap;
var keys;

export class UI extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UI', active: true });
		//super( 'UI' );
    }

    preload() {
		this.load.image('UImap', 'assets/map.png');
	}

    create() {
		UImap = this.add.sprite(382, 16, 'UImap');
		UImap.setVisible(false);
		
		function mapShow() {
			UImap.setVisible(true);
		}
		
		keys = this.input.keyboard.addKeys("M");
    }
	
	update() {
		if (keys.M.isDown) {
			UImap.setVisible(true);
		}
	}
}