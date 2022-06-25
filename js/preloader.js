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
		this.load.atlas('sprites', 'img/spritesheet.png', 'img/spritesheet.json');
		this.load.bitmapFont('fontwhite', 'img/fontwhite.png', 'img/fontwhite.xml');
		//this.load.image('bg', 'img/bg.jpg');
		this.load.audio('bg_sound', ['snd/bg.mp3']);
	},

	create: function () {
		this.anims.create({
			frames: [
				{ key: 'sprites', frame: "arrow" },
				{ key: 'sprites', frame: "bra_1" },
				{ key: 'sprites', frame: "bra_2" },
				{ key: 'sprites', frame: "bra_3" },
				{ key: 'sprites', frame: "btn_bg_done" },
				{ key: 'sprites', frame: "btn_bg_retry" },
				{ key: 'sprites', frame: "btn_try2" },
				{ key: 'sprites', frame: "complete_bar" },
				{ key: 'sprites', frame: "dress_on_hanger" },
				{ key: 'sprites', frame: "frame_pink" },
				{ key: 'sprites', frame: "frame_yellow" },
				{ key: 'sprites', frame: "hamper_1" },
				{ key: 'sprites', frame: "hamper_2" },
				{ key: 'sprites', frame: "hamper_3" },
				{ key: 'sprites', frame: "icon_Dress" },
				{ key: 'sprites', frame: "icon_Underpants" },
				{ key: 'sprites', frame: "icon_Underwear" },
				{ key: 'sprites', frame: "scene_bg" },
				{ key: 'sprites', frame: "shelf" },
				{ key: 'sprites', frame: "star" },
				{ key: 'sprites', frame: "star_active" },
				{ key: 'sprites', frame: "text_1" },
				{ key: 'sprites', frame: "text_2" },
				{ key: 'sprites', frame: "text_3" },
				{ key: 'sprites', frame: "underpants_1" },
				{ key: 'sprites', frame: "underpants_2" },
				{ key: 'sprites', frame: "underpants_3" },
				{ key: 'sprites', frame: "waves" },
				{ key: 'sprites', frame: "yijia" },
				{ key: 'sprites', frame: "yijia3" },
				{ key: 'sprites', frame: "btn_restart" },
				{ key: 'sprites', frame: "btn_done" },
				{ key: 'sprites', frame: "dress" },
			],
		});
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		this.scene.start('gamescene');
	}
});
