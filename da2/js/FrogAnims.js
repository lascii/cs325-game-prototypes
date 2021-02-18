import "./phaser.js";

const createFrogAnims = (anims: Phaser.Animations.AnimationManager) => {
	this.anims.create({
		key: 'frog-idle',
		frames: anims.generateFrameNames('frog', { prefix: 'spr_frog_g_idle_anim', suffix: '.png' }),
		repeat: -1,
		frameRate: 11
	});	
}

export{
	createFrogAnims
}