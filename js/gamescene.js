var statusBarComplete, statusBar;
var GameScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function GameScene() {
			Phaser.Scene.call(this, { key: 'gamescene' });
		},
	
	preload: function () {
	},

	create: function () {
		this.screenEndpoints = {
			left: config.width/2 - (screen.width/2),
			right: config.width/2 + (screen.width/2),
		};
        this.createBg();
		this.createHampers();
		this.createCompleteBar();
		//this.updateBar(55);
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

		this.hamper_2 = this.add.sprite(config.width/2, config.height - 5, 'sprites', 'hamper_2').setScale(.35).setOrigin(.5, 1);
		
		this.hamper_1 = this.add.sprite(config.width/2, 500, 'sprites', 'hamper_1').setScale(.35).setOrigin(.5, 1);
		this.hamper_1.setPosition(config.width/2 - this.hamper_2.width * .35, config.height - 5);

		this.hamper_3 = this.add.sprite(config.width/2, 500, 'sprites', 'hamper_3').setScale(.35).setOrigin(.5, 1);
		this.hamper_3.setPosition(config.width/2 + this.hamper_2.width * .35, config.height - 5);
	},

	createCompleteBar(){
		statusBar = this.add.sprite(this.screenEndpoints.left, config.height/2, 'sprites', 'statusBarEmpty');
		statusBar.alpha = 0.68;
		statusBarComplete = this.add.sprite(this.screenEndpoints.left, config.height/2, 'sprites', 'statusBarComplete');
		statusBarComplete.flipY = true;
		statusBarComplete.frame.cutHeight = 0;
		statusBarComplete.frame.updateUVs();
		this.progressArrow = this.add.sprite(statusBar.x + statusBar.width - 24/2, statusBar.y + statusBar.height/2, 'sprites', 'progressArrow').setDisplaySize(24,25).setOrigin(1, 0.5);
	},

	updateBar(value){
		let all_heigt = statusBar.height;
		let one_percent = all_heigt / 100;
		let new_value = one_percent * value;
		statusBarComplete.frame.cutHeight = new_value;
		statusBarComplete.frame.updateUVs();
		this.progressArrow.y = statusBar.y + statusBar.height/2 - new_value; 
	},
});
