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
		this.load.atlas('sprites', 'img/spritesheet.png', 'img/spritesheet.json');
		this.load.audio('theme', ['snd/bg.mp3']);
		this.load.audio('dress_on', ['snd/skirt.mp3']);
		this.load.audio('basketup', ['snd/basketup.mp3']);
		this.load.audio('shelf', ['snd/Open.mp3']);
		this.load.audio('encourage', ['snd/encourage.mp3']);
		this.load.audio('bra', ['snd/currency.mp3']);
		this.load.audio('underpants', ['snd/trousers.mp3']);
		this.load.audio('fireworks', ['snd/fireworks.mp3']);
		this.load.audio('button', ['snd/button.mp3']);
	},

	create: function () {
		this.anims.create({
			frames: [
				{ key: 'sprites', frame: "start_text" },
				{ key: 'sprites', frame: "arrow" },
				{ key: 'sprites', frame: "progressArrow" },
				{ key: 'sprites', frame: "bra_0" },
				{ key: 'sprites', frame: "bra_1" },
				{ key: 'sprites', frame: "bra_2" },
				{ key: 'sprites', frame: "bra_3" },
				{ key: 'sprites', frame: "bra_4" },
				{ key: 'sprites', frame: "btn_bg_done" },
				{ key: 'sprites', frame: "btn_bg_retry" },
				{ key: 'sprites', frame: "btn_try2" },
				{ key: 'sprites', frame: "statusBarComplete" },
				{ key: 'sprites', frame: "statusBarEmpty" },
				{ key: 'sprites', frame: "dress_on_hanger" },
				{ key: 'sprites', frame: "dress_fold" },
				{ key: 'sprites', frame: "hamper_2" },
				{ key: 'sprites', frame: "hamper_1" },
				{ key: 'sprites', frame: "hamper_0" },
				{ key: 'sprites', frame: "scene_bg" },
				{ key: 'sprites', frame: "shelf" },
				{ key: 'sprites', frame: "star" },
				{ key: 'sprites', frame: "star_active" },
				{ key: 'sprites', frame: "bigstar" },
				{ key: 'sprites', frame: "bigstar_active" },
				{ key: 'sprites', frame: "text_1" },
				{ key: 'sprites', frame: "text_2" },
				{ key: 'sprites', frame: "text_3" },
				{ key: 'sprites', frame: "text_4" },
				{ key: 'sprites', frame: "text_5" },
				{ key: 'sprites', frame: "underpants_0" },
				{ key: 'sprites', frame: "underpants_1" },
				{ key: 'sprites', frame: "underpants_2" },
				{ key: 'sprites', frame: "underpants_3" },
				{ key: 'sprites', frame: "fold_underpants_0" },
				{ key: 'sprites', frame: "fold_underpants_1" },
				{ key: 'sprites', frame: "fold_underpants_2" },
				{ key: 'sprites', frame: "fold_underpants_3" },
				{ key: 'sprites', frame: "waves" },
				{ key: 'sprites', frame: "dress" },
				{ key: 'sprites', frame: "additional_0" },
				{ key: 'sprites', frame: "additional_1" },
				{ key: 'sprites', frame: "additional_2" },
				{ key: 'sprites', frame: "waves_top" },
				{ key: 'sprites', frame: "waves_texture" },
				{ key: 'sprites', frame: "finish_closet" },
				{ key: 'sprites', frame: "hand" },
				{ key: 'sprites', frame: "empty" },
			],
		});
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		this.scene.start('GameScene');
	}
});
