import "./phaser.js";

const debugDraw = (layer: Phaser.Tilemaps.StaticTilemapLayer, scene: Phaser.Scene) => {
		
		const debugGraphics = scene.add.graphics().setAlpha(0.7);
		layer.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		});
		
}

export {
	debugDraw
}