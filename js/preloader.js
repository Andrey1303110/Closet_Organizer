class Preloader extends Phaser.Scene {
	constructor() {
        super("Preloader");
    }

	preload() {
	}

	create() {
		this.scene.start('GameScene');
	}
}
