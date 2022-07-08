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

		this.textures.addBase64('progressArrow', base64.progressArrow);
		this.textures.addBase64('bra_0', base64.bra_0);
		this.textures.addBase64('bra_1', base64.bra_1);
		this.textures.addBase64('bra_2', base64.bra_2);
		this.textures.addBase64('bra_3', base64.bra_3);
		this.textures.addBase64('bra_4', base64.bra_4);
		this.textures.addBase64('btn_bg_done', base64.btn_bg_done);
		this.textures.addBase64('btn_bg_done_green', base64.btn_bg_done_green);
		this.textures.addBase64('btn_bg_retry', base64.btn_bg_retry);
		this.textures.addBase64('statusBarComplete', base64.statusBarComplete);
		this.textures.addBase64('statusBarEmpty', base64.statusBarEmpty);
		this.textures.addBase64('dress_on_hanger', base64.dress_on_hanger);
		this.textures.addBase64('dress_fold', base64.dress_fold);
		this.textures.addBase64('hamper_0', base64.hamper_0);
		this.textures.addBase64('hamper_1', base64.hamper_1);
		this.textures.addBase64('hamper_2', base64.hamper_2);
		this.textures.addBase64('scene_bg', base64.scene_bg);
		this.textures.addBase64('shelf', base64.shelf);
		this.textures.addBase64('star', base64.star);
		this.textures.addBase64('star_active', base64.star_active);
		this.textures.addBase64('bigstar_active', base64.bigstar_active);		
		this.textures.addBase64('bigstar', base64.bigstar);
		this.textures.addBase64('text_1', base64.text_1);
		this.textures.addBase64('text_2', base64.text_2);
		this.textures.addBase64('text_3', base64.text_3);
		this.textures.addBase64('text_4', base64.text_4);
		this.textures.addBase64('text_5', base64.text_5);
		this.textures.addBase64('underpants_0', base64.underpants_0);
		this.textures.addBase64('underpants_1', base64.underpants_1);
		this.textures.addBase64('underpants_2', base64.underpants_2);
		this.textures.addBase64('underpants_3', base64.underpants_3);
		this.textures.addBase64('fold_underpants_0', base64.fold_underpants_0);
		this.textures.addBase64('fold_underpants_1', base64.fold_underpants_1);
		this.textures.addBase64('fold_underpants_2', base64.fold_underpants_2);
		this.textures.addBase64('fold_underpants_3', base64.fold_underpants_3);
		this.textures.addBase64('additional_0', base64.additional_0);
		this.textures.addBase64('additional_1', base64.additional_1);
		this.textures.addBase64('additional_2', base64.additional_2);
		this.textures.addBase64('hand', base64.hand);
		this.textures.addBase64('finish_closet', base64.finish_closet);
		this.textures.addBase64('waves_texture', base64.waves_texture);
		this.textures.addBase64('wave0', base64.wave0);
		this.textures.addBase64('wave1', base64.wave1);
		this.textures.addBase64('wave2', base64.wave2);
		this.textures.addBase64('wave3', base64.wave3);
		this.textures.addBase64('wave4', base64.wave4);
		this.textures.addBase64('wave5', base64.wave5);
		this.textures.addBase64('wave6', base64.wave6);
		this.textures.addBase64('playNowButton', base64.playNowButton);
		this.textures.addBase64('empty', base64.empty);
		this.textures.addBase64('gradient_bg', base64.gradient_bg);

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
