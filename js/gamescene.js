var GameScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function GameScene() {
			Phaser.Scene.call(this, { key: 'gamescene' });
		},
	
	preload: function () {
	},

	create: function () {
		this.setEndpoints();
		this.progresStages = {
			1: .5,
			2: .8,
			3: 1,
		};
		this.currentGameProgress = 100;
        this.createBg();
		this.createHampers();
		this.createCompleteBar();
		this.updateBar(this.currentGameProgress);
    },

	setEndpoints(){
		if (screen.width >= screen.height){
			this.screenEndpoints = {
				left: (config.width * .075),
				right: config.width - (config.width * .075),
			};
		}
		else {
			this.screenEndpoints = {
				left: (config.width/2) - screen.width/2 * config.width/screen.height,
				right: (config.width/2) + screen.width/2 * config.width/screen.height,
			};
		}
	},

	createBg(){
		this.sceneBG = this.add.sprite(config.width/2, config.height/2, 'sprites', 'scene_bg');

		let scaleX = this.cameras.main.width / this.sceneBG.width;
		let scaleY = this.cameras.main.height / this.sceneBG.height;
		let scale = Math.max(scaleX, scaleY);
		this.sceneBG.setScale(scale).setScrollFactor(0);


		this.bg_sound = this.sound.add('bg_sound');
		this.bg_sound.play();
	},

	createHampers(){
		this.hampers = [];
		for (let i = 1; i <= 3; i++) {
			hamper = {
				x: 0,
				y: 0,
				image: `hamper_${i}`,
			};
		}

		this.hamper_2 = this.add.sprite(config.width/2, config.height, 'sprites', 'hamper_2').setScale(.38).setOrigin(.5, 1);
		this.hamper_2_Frame = this.add.sprite(this.hamper_2.x, this.hamper_2.y - this.hamper_2.displayHeight, 'sprites', 'frame_yellow').setScale(.6).setOrigin(.5, 1);
		this.hamper_2_Icon = this.add.sprite(this.hamper_2.x, this.hamper_2_Frame.y, 'sprites', 'icon_Underwear').setScale(.6).setOrigin(.5, 1.4);
		this.hamper_2_MiniIcon = this.add.sprite(this.hamper_2_Icon.x + this.hamper_2_Frame.displayWidth/2, this.hamper_2_Icon.y - this.hamper_2_Frame.displayHeight, 'sprites', 'icon_shelf').setScale(.6).setOrigin(.5,0);
		
		this.hamper_1 = this.add.sprite(0, 0, 'sprites', 'hamper_1').setScale(.38).setOrigin(.5, 1);
		this.hamper_1.setPosition(config.width/2 - this.hamper_2.width * .38, config.height);
		this.hamper_1_Frame = this.add.sprite(this.hamper_1.x, this.hamper_1.y - this.hamper_1.displayHeight, 'sprites', 'frame_pink').setScale(.6).setOrigin(.5, 1);
		this.hamper_1_Icon = this.add.sprite(this.hamper_1.x, this.hamper_1_Frame.y, 'sprites', 'icon_Dress').setScale(.6).setOrigin(.5, 1.4);
		this.hamper_1_MiniIcon = this.add.sprite(this.hamper_1_Icon.x + this.hamper_1_Frame.displayWidth/2, this.hamper_1_Icon.y - this.hamper_1_Frame.displayHeight, 'sprites', 'icon_hanger').setScale(.6).setOrigin(.5,0);

		this.hamper_3 = this.add.sprite(0, 0, 'sprites', 'hamper_3').setScale(.38).setOrigin(.5, 1);
		this.hamper_3.setPosition(config.width/2 + this.hamper_2.width * .38, config.height);
		this.hamper_3_Frame = this.add.sprite(this.hamper_3.x, this.hamper_3.y - this.hamper_3.displayHeight, 'sprites', 'frame_yellow').setScale(.6).setOrigin(.5, 1);
		this.hamper_3_Icon = this.add.sprite(this.hamper_3.x, this.hamper_3_Frame.y, 'sprites', 'icon_Underpants').setScale(.6).setOrigin(.5, 1.4);
		this.hamper_3_MiniIcon = this.add.sprite(this.hamper_3_Icon.x + this.hamper_3_Frame.displayWidth/2, this.hamper_3_Icon.y - this.hamper_3_Frame.displayHeight, 'sprites', 'icon_shelf').setScale(.6).setOrigin(.5,0);
	},

	createCompleteBar(){
		this.statusBar = this.add.sprite(this.screenEndpoints.left, config.height/2.35, 'sprites', 'statusBarEmpty');
		this.statusBar.alpha = 0.68;
		
		this.statusBarComplete = this.add.sprite(this.screenEndpoints.left, config.height/2.35, 'sprites', 'statusBarComplete');
		this.statusBarComplete.flipY = true;
		this.statusBarComplete.frame.cutHeight = 0;
		this.statusBarComplete.frame.updateUVs();

		this.statusBarStar1 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - this.progresStages[1])), 'sprites', 'star').setDisplaySize(45, 40);
		this.statusBarStar2 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - this.progresStages[2])), 'sprites', 'star').setDisplaySize(45, 40);
		this.statusBarStar3 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - this.progresStages[3])), 'sprites', 'star').setDisplaySize(45, 40);

		this.progressArrow = this.add.sprite(this.statusBar.x + this.statusBar.width, this.statusBar.y + this.statusBar.height/2, 'sprites', 'progressArrow').setDisplaySize(18,20).setOrigin(1, 0.5);
	},

	updateBar(value){
		if (value > 100) {
			value = 100;
		}
		else if (value < 0) {
			value = 0;
		}

		let all_heigt = this.statusBar.height;
		let one_percent = all_heigt / 100;
		let new_value = one_percent * value;
		this.statusBarComplete.frame.cutHeight = new_value;
		this.statusBarComplete.frame.updateUVs();
		this.progressArrow.y = this.statusBar.y + this.statusBar.height/2 - new_value;

		if (this.currentGameProgress >= this.progresStages[1] * 100) {
			this.statusBarStar1.setTexture('sprites', 'star_active');
			if (this.currentGameProgress >= this.progresStages[2] * 100) {
				this.statusBarStar2.setTexture('sprites', 'star_active');
				if (this.currentGameProgress >= this.progresStages[3] * 100) {
					this.statusBarStar3.setTexture('sprites', 'star_active');
				}
			}
		}
	},
});
