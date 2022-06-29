var test;
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload(){}

    create(){
        this.createSounds();
        this.setEndpoints();
		this.currentGameProgress = 78;
        this.selectedСlothing = null;
        this.shelfActive = false;
        this.shelf_matrix = [];
        this.shelf_level = 0;
        this.clothing_nums_on = {
            'dress': 0,
            'bra': 0,
            'underpants': 0
        };
        this.click_area = {
            bra: [],
            underpants: []
        };
        this.createBackground();
        this.createLelvelText();
		this.createHampers();
		this.createCompleteBar();
		this.updateBar(this.currentGameProgress);

        this.addObjectsInHamper();
        this.addClickAreaDress();
    }

    createSounds(){
        this.sounds = {
            basketup: this.sound.add('basketup', {volume: 0.5}),
            shelf: this.sound.add('shelf', {volume: 0.5}),
            dress_on: this.sound.add('dress_on'),
            encourage: this.sound.add('encourage'),
            bra: this.sound.add('bra'),
            underpants: this.sound.add('underpants'),
            //success: this.sound.add('success'),
            theme: this.sound.add('theme', {volume: 0.33}),
        }
        this.sounds.theme.loop = true;
        //this.sounds.theme.play();
    }

    setEndpoints(){
		if (screen.width >= screen.height){
			this.screenEndpoints = {
				left: (config.width * .075),
				right: config.width - (config.width * .075),
			};
		}
		else {
			this.screenEndpoints = {
				left: (config.width/2) - screen.width/2 * config.width/screen.height + screen.width * .025,
                //left: 0 + config.width * .07,
				//right: config.width - config.width * .07,
                right: (config.width/2) + screen.width/2 * config.width/screen.height - screen.width * .025,
			};
		}
	}

    createBackground(){
        this.sceneBG = this.add.sprite(config.width/2, config.height/2, 'sprites', 'scene_bg');

		let scaleX = this.cameras.main.width / this.sceneBG.width;
		let scaleY = this.cameras.main.height / this.sceneBG.height;
		let scale = Math.max(scaleX, scaleY);
		this.sceneBG.setScale(scale).setScrollFactor(0);
    }

    createLelvelText(){
        this.add.text(config.width/2, 75, 'Level 1', {
            font: '32px sans-serif',
            fill: '#fff',
        }).setOrigin(0.5);
    }

    createHampers(){
        this.hampers = [];
        for(let i = 0; i < 3; i++) {
            this.hampers.push(new Hamper(this, i, config.hamperNames[i]));
        }
        this.hampers[0].setPosition(config.width/2 - this.hampers[1].width * .38, config.height);
        this.hampers[2].setPosition(config.width/2 + this.hampers[1].width * .38, config.height);

        for(let i = 0; i < 3; i++) {
            this.hampers[i].add_additional_images(i);

            this.hampers[i].on('pointerdown', function () {
                if (this.isActive) {
                    for(let j = 0; j < this.scene.hampers.length; j++) {
                        if (this.scene.hampers[j].isActive) {
                            this.scene.hampers[j].objectsIn.forEach(object => {
                                object.y += 37;
                                object.scale -= .12; 
                                object.depth = 2; 
                            });
                        }
                    }
                    this.isActive = false;
                    this.scene.selectedСlothing = null;
                    this.setDepth(0);
                    this.setDisplaySize(config.hamper.width, config.hamper.height);
                    this.additional_images.setPosition(this.additional_images.x, this.y - config.hamper.height);
                }
                else {
                    for(let i = 0; i < this.scene.hampers.length; i++) {
                        if (this.scene.hampers[i].isActive) {
                            this.scene.hampers[i].objectsIn.forEach(object => {
                                object.y += 37;
                                object.scale -= .12; 
                                object.depth = 2; 
                            });
                        }
                        this.scene.hampers[i].isActive = false;
                        this.scene.hampers[i].setDepth(0);
                        this.scene.hampers[i].setDisplaySize(config.hamper.width, config.hamper.height);
                        this.scene.hampers[i].additional_images.setPosition(this.scene.hampers[i].additional_images.x, this.scene.hampers[i].y - config.hamper.height);
                    }
                    this.isActive = true;
                    this.scene.selectedСlothing = this.name;
                    this.setDepth(1);
                    this.setDisplaySize(config.hamper.width + config.hamper.width * .28, config.hamper.height + config.hamper.height * .28);
                    this.additional_images.setPosition(this.additional_images.x, this.additional_images.y - config.hamper.height * .28);

                    this.objectsIn.forEach(object => {
                        object.y -= 37;
                        object.scale += .12; 
                        object.depth = 3; 
                    });
                }
                this.scene.sounds.basketup.play();
                console.log(this.scene.selectedСlothing);
            });
        }
    }

	createCompleteBar(){
		this.statusBar = this.add.sprite(this.screenEndpoints.left, config.height/2.35, 'sprites', 'statusBarEmpty');
		this.statusBar.alpha = 0.68;
		
		this.statusBarComplete = this.add.sprite(this.screenEndpoints.left, config.height/2.35, 'sprites', 'statusBarComplete');
		this.statusBarComplete.flipY = true;
		this.statusBarComplete.frame.cutHeight = 0;
		this.statusBarComplete.frame.updateUVs();

		this.statusBarStar1 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - config.progresStages[1])), 'sprites', 'star').setDisplaySize(45, 40);
		this.statusBarStar2 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - config.progresStages[2])), 'sprites', 'star').setDisplaySize(45, 40);
		this.statusBarStar3 = this.add.sprite(this.screenEndpoints.left, this.statusBar.y - (this.statusBar.height/2) + (this.statusBar.height * (1 - config.progresStages[3])), 'sprites', 'star').setDisplaySize(45, 40);

		this.progressArrow = this.add.sprite(this.statusBar.x + this.statusBar.width, this.statusBar.y + this.statusBar.height/2, 'sprites', 'progressArrow').setDisplaySize(18,20).setOrigin(1, 0.5);
	}

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

		if (this.currentGameProgress >= config.progresStages[1] * 100) {
			this.statusBarStar1.setTexture('sprites', 'star_active');
			if (this.currentGameProgress >= config.progresStages[2] * 100) {
				this.statusBarStar2.setTexture('sprites', 'star_active');
				if (this.currentGameProgress >= config.progresStages[3] * 100) {
					this.statusBarStar3.setTexture('sprites', 'star_active');
				}
			}
		}
	}

    generateRandom(min, max) {
        let difference = max - min;
        let rand = Math.random(); 
        rand = Math.floor( rand * difference);
        rand = rand + min;
        return rand;
    }

    addObjectsInHamper(){
        this.hampers.forEach(hamper => {
            hamper.objectsIn = [];
            let step;
            switch (hamper.name) {
                case 'dress':
                    step = 6;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * 1/33, hamper.x + hamper.x * 1/33), hamper.y - hamper.displayHeight + 107 - (this.generateRandom(0, step) * i), 'sprites', 'dress_fold').setDisplaySize(hamper.displayWidth - hamper.displayWidth * .4, hamper.displayWidth - hamper.displayWidth * .25,).setAngle(this.generateRandom(-25, 25));
                    }
                break;
                case 'bra':
                    step = 4;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = 'bra_' + Math.round(Math.random() * 4);
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * 1/33, hamper.x + hamper.x * 1/33), hamper.y - hamper.displayHeight + 125 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(81, 42).setAngle(this.generateRandom(60, 120));
                    }
                break;
                case 'underpants':
                    step = 3.5;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = 'underpants_' + Math.round(Math.random() * 2);
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * 1/33, hamper.x + hamper.x * 1/33), hamper.y - hamper.displayHeight + 137 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(81, 42).setAngle(this.generateRandom(-40, 40));
                    }
                break;
            }
        });
    }

    addClickAreaDress(){
        this.dress_area = [];
        this.underpants_area = [];
        this.shelf_matrix = [];
        let all_width = 315;

        for (let i = 0; i < config.clothingSettings.dress.nums; i++) {
            this.dress_area.push(this.add.sprite(config.width/2 - all_width/2 + all_width/config.clothingSettings.dress.nums * i + all_width/config.clothingSettings.dress.nums/2, 340, 'sprites', 'empty').setAlpha(.001).setDisplaySize(all_width/config.clothingSettings.dress.nums, 460).setInteractive());
        }

        this.dress_area.forEach(area => {
            area.on('pointermove', function(pointer){
                if (pointer.active) {
                    if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings.dress.nums || this.selectedСlothing !== 'dress') {
                        return;
                    }
                    this.clothing_nums_on[this.selectedСlothing]++;
                    if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings.dress.nums) {
                        this.sounds.encourage.play();
                    }
                    this.sounds.dress_on.play();
                    this.add.sprite(area.x, 367, 'sprites', 'dress_on_hanger').setDisplaySize(27, 460);
                    this.hampers.forEach(hamper => {
                        if (hamper.name === 'dress') {
                            hamper.objectsIn.pop().destroy();
                        }
                    });
                    area.removeInteractive();
                }
            }, this);
        });

        this.shelf_area = this.add.sprite(config.width/2, config.height * .65, 'sprites', 'empty').setAlpha(.01).setDisplaySize(all_width, 150).setInteractive();
        this.shelf_area.on('pointerdown', this.openShelf, this);
    }

    addClickArea(){
        let clothing_on_level = config.clothingSettings[this.selectedСlothing].height*config.clothingSettings[this.selectedСlothing].width;
        let levels = Math.ceil(config.clothingSettings[this.selectedСlothing].nums/clothing_on_level);
        let y = this.shelf.y - (this.shelf.displayHeight*.9)/2 + this.shelf.displayHeight/config.clothingSettings[this.selectedСlothing].height/2;
        let x = this.shelf.x - (this.shelf.displayWidth*.9)/2 - (this.shelf.displayWidth*.9)/config.clothingSettings[this.selectedСlothing].width/2;

        console.log(x);

        for (let i = 0; i < clothing_on_level; i++) {
            x += this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width*.9;
            if(i%config.clothingSettings[this.selectedСlothing].width === 0 && i > 0) {
                x = this.shelf.x - (this.shelf.displayWidth*.9)/2 + ((this.shelf.displayWidth*.9)/config.clothingSettings[this.selectedСlothing].width / 2);
                y += this.shelf.displayHeight*.9/config.clothingSettings[this.selectedСlothing].height;
            }
            this.click_area[this.selectedСlothing].push(this.add.sprite(x, y, 'sprites', 'empty').setAlpha(.35).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height - 7).setInteractive());
        }
        test = this.click_area[this.selectedСlothing][0];

        this.click_area[this.selectedСlothing].forEach(area => {
            area.on('pointermove', function(pointer){
                if (pointer.active) {
                    if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings[this.selectedСlothing].nums || this.selectedСlothing !== this.selectedСlothing) {
                        return;
                    }
                    this.clothing_nums_on[this.selectedСlothing]++;

                    this.hampers.forEach(hamper => {
                        if (hamper.name === this.selectedСlothing) {
                            let object = hamper.objectsIn.pop();
                            let sprite_frame = object.frame.name;
                            if (this.selectedСlothing === 'underpants') {
                                sprite_frame = 'fold_' + sprite_frame;
                            }
                            this.click_area[this.selectedСlothing].push(this.add.sprite(area.x, area.y, 'sprites', sprite_frame).setDisplaySize(this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width * .9, this.shelf.displayHeight/config.clothingSettings[this.selectedСlothing].height * .9));
                            object.destroy();
                            area.destroy();
                            this.click_area[this.selectedСlothing].forEach(element => {
                                 if (element.x === area.x && element.y === area.y && element.frame.name !== 'empty') {
                                    this.click_area[this.selectedСlothing]
                                 }
                            });

                            for (let j = 0; j < this.click_area[this.selectedСlothing].length; j++) {
                                if (this.click_area[this.selectedСlothing][j].x === area.x && this.click_area[this.selectedСlothing][j].y === area.y && this.click_area[this.selectedСlothing][j].frame.name !== 'empty') {
                                    this.click_area[this.selectedСlothing].splice(j, 1);
                                 }
                                
                            }
                        }
                    });
                    this.sounds[this.selectedСlothing].play();
                    if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings[this.selectedСlothing].nums) {
                        this.sounds.encourage.play();
                    }

                    if (this.clothing_nums_on[this.selectedСlothing] % clothing_on_level === 0 && this.clothing_nums_on[this.selectedСlothing] < config.clothingSettings[this.selectedСlothing].nums) {
                        this.shelf_level = Math.ceil(this.clothing_nums_on[this.selectedСlothing]/clothing_on_level);
                        console.log('add area');
                        this.addClickArea();
                    }
                }
            }, this);
        });
    }

    openShelf(){
        if (!this.selectedСlothing) {
            return;
        }
        if (this.shelfActive) {
            this.shelfActive = false;
            this.shelf.destroy();
            //this.click_area[this.selectedСlothing].destroy();
        }
        else {
            this.shelfActive = true;
            this.shelf = this.add.sprite(config.width/2, this.shelf_area.y - this.shelf_area.displayHeight/2, 'sprites', 'shelf').setScale(.75).setInteractive();

            let clothing_on_level = config.clothingSettings[this.selectedСlothing].height*config.clothingSettings[this.selectedСlothing].width;
            let levels = Math.ceil(config.clothingSettings[this.selectedСlothing].nums/clothing_on_level);

            for (let k = 0; k < levels; k++) {
                this.shelf_matrix[k] = [];
                for (let i = 0; i < config.clothingSettings[this.selectedСlothing].height; i++) {
                    this.shelf_matrix[k].push([]);
                    for (let j = 0; j < config.clothingSettings[this.selectedСlothing].width; j++) {
                        this.shelf_matrix[k][i].push([]);
                    }
                }
            }

            console.log(this.shelf_matrix);

            this.addClickArea();
        }
        this.sounds.shelf.play();
    }

    /*

    start(){
        this.config = {
            rows: config.levels[this.currentLevel].rows,
            cols: config.levels[this.currentLevel].cols,
            timeout: config.levels[this.currentLevel].timer,
            cards: config.levels[this.currentLevel].cards,
        };
        this.levelText.setText(`Level: ${this.currentLevel}/${this.maxLevel}`);
        this.createCards();
        this.initCardsPositions();
        this.timeout = this.config.timeout;
        this.timer.paused = false;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.streak = 0;
        this.mistake = false;
        this.initCards();
        this.showCards();
        this.isStarted = true;
    }

    restart(){
        if (!this.isStarted) {
            return;
        }
        this.isStarted = false;
        let count = 0;
        let onCardMoveComplete = () => {
            count++;
            if (count >= cards.length) {
                this.start();
            }
        };
        cards.forEach(card => {
            card.move({
                x: config.width + card.width,
                y: config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete,
            });
        });
    }
    */
}
