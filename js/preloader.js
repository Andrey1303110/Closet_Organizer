var Preloader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function Preloader() {
			Phaser.Scene.call(this, {
				key: 'Preloader',
				pack: {
					files: [
						{ type: 'image', key: 'loadingbar_bg', url: 'img/loadingbar_bg.png' },
						{ type: 'image', key: 'loadingbar_fill', url: 'img/loadingbar_fill.png' }
					]
				}
			});
		},

	setPreloadSprite: function (sprite) {
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };
		sprite.visible = true;
		this.load.on('progress', this.onProgress, this);
	},

	onProgress: function (value) {

		if (this.preloadSprite) {
			var w = Math.floor(this.preloadSprite.width * value);
			this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
			this.preloadSprite.sprite.frame.cutWidth = w;
			this.preloadSprite.sprite.frame.updateUVs();
		}
	},

	preload: function () {
		this.loadingbar_bg = this.add.sprite(config.width / 2, 300, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(config.width / 2, 300, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);
		this.load.image('gradient_bg', "img/gradient_bg.png");
		this.load.atlas('sprites', 'img/spritesheet_hd.png', 'img/spritesheet.json');
		this.load.audio('theme', ['snd/bg.mp3']);
		this.load.audio('dress_on', ['snd/skirt.mp3']);
		this.load.audio('basketup', ['snd/basketup.mp3']);
		this.load.audio('shelf', ['snd/Open.mp3']);
		this.load.audio('encourage', ['snd/encourage.mp3']);
		this.load.audio('bra', ['snd/currency.mp3']);
		this.load.audio('underpants', ['snd/trousers.mp3']);
		this.load.audio('fireworks', ['snd/fireworks.mp3']);
		this.load.audio('progress', ['snd/progress.mp3']);
		this.load.audio('button', ['snd/button.mp3']);
		this.load.audio('star', ['snd/stars.mp3']);
	},

	create: function () {
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		this.scene.start('GameScene');
	}
});
