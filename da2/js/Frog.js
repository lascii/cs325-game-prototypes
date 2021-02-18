import Phaser from 'phaser'

export default class Frog extends Phaser.Physics.Arcade.Sprite
{
	constructor(Scene, x: number, y: number, texture: string, frame?: string)
	{
		super(scene, x, y, texture, frame)
	}
}