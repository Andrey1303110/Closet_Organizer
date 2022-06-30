var test;
var retry;
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload(){}

    create(){
        this.createSounds();
        this.setEndpoints();
        this.createBackground();
        this.createLevelText();
		this.createCompleteBar();
        this.start();
    }

    start(){
        this.currentGameProgress = 0;
        this.updateBar(this.currentGameProgress);
        this.selectedСlothing = null;
        this.shelfActive = false;
        this.shelf_level = {
            bra: 0,
            underpants: 0,
        };
        this.clothing_nums_on = {
            dress: null,
            bra: null,
            underpants: null,
        };
        this.active_click_area_nums = {
            dress: 0,
            bra: 0,
            underpants: 0,
        };
        this.click_area = {
            dress: [],
            bra: [],
            underpants: [],
        };
        this.createHampers();
        this.addObjectsInHamper();
        this.addClickAreaDress();

        retry = this.add.sprite(this.screenEndpoints.right, config.height/2, 'sprites', 'btn_bg_retry').setInteractive();
        retry.on('pointerdown', this.restart, this);
    }

    restart(){
        for (let i = 0; i < this.dress_on_hanger.length; i++) {
            this.dress_on_hanger[i].destroy();
        }
        this.dress_on_hanger = [];
        this.hampers.forEach(hamper => {
            hamper.destroy();
            hamper.additional_images.destroy();
            hamper.additional_images = [];
            for (let i = 0; i < hamper.objectsIn.length; i++) {
                hamper.objectsIn[i].destroy();
            }
            hamper.objectsIn = [];
        });
        this.start();
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

    createLevelText(){
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
            });

            this.hampers[1].on('pointerdown', this.addClickAreaBra, this);
            this.hampers[2].on('pointerdown', this.addClickAreaUnderpants, this);
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

    getPercentOfClothe(clothe){
        this.currentGameProgress += config.clothingSettings[clothe].percentage;
        this.updateBar(this.currentGameProgress);
    }

    generateRandom(min, max) {
        let difference = max - min;
        let rand = Math.random(); 
        rand = Math.floor(rand * difference);
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
                    step = 7;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = 'bra_' + Math.round(Math.random() * 4);
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * 1/50, hamper.x + hamper.x * 1/50), hamper.y - hamper.displayHeight + 133 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(100, 50).setAngle(this.generateRandom(-15, 15));
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
        this.dress_on_hanger = [];
        let closet_width = 315;

        for (let i = 0; i < config.clothingSettings.dress.nums; i++) {
            this.click_area['dress'].push(this.add.sprite(config.width/2 - closet_width/2 + closet_width/config.clothingSettings.dress.nums * i + closet_width/config.clothingSettings.dress.nums/2, 340, 'sprites', 'empty').setAlpha(.001).setDisplaySize(closet_width/config.clothingSettings.dress.nums, 460).setInteractive());
        }

        this.click_area['dress'].forEach(area => {
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
                    this.dress_on_hanger.push(this.add.sprite(area.x, 367, 'sprites', 'dress_on_hanger').setDisplaySize(27, 460));
                    this.hampers.forEach(hamper => {
                        if (hamper.name === 'dress') {
                            hamper.objectsIn.pop().destroy();
                        }
                    });
                    area.removeInteractive();

                    this.getPercentOfClothe(this.selectedСlothing);
                }
            }, this);
        });

        this.shelf_area = this.add.sprite(config.width/2, config.height * .65, 'sprites', 'empty').setAlpha(.001).setDisplaySize(closet_width, 150).setInteractive();
        this.shelf_area.on('pointerdown', this.openShelf, this);
    }

    addClickAreaBra(){
        if ((this.selectedСlothing != config.hamperNames[1]) || !this.shelfActive) {
            return;
        }

        if ((this.click_area['bra'].length > 0) && (this.click_area['bra'].length % (config.clothingSettings['bra'].nums / config.clothingSettings['bra'].vertical)) !== 0) {
            return;
        }

        if (this.active_click_area_nums.bra > 0) {
            return;
        }

        if (this.hampers[1].objectsIn <= 0) {
            return;
        }

        let y = this.shelf.y - (this.shelf.displayHeight*.9)/2 + this.shelf.displayHeight/config.clothingSettings[this.selectedСlothing].height/2;
        let x = this.shelf.x - (this.shelf.displayWidth*.9)/2 - (this.shelf.displayWidth*.9)/config.clothingSettings[this.selectedСlothing].width/2;

        for (let i = 0; i < config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines; i++) {
            x += this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width*.9;
            if(i%config.clothingSettings[this.selectedСlothing].width === 0 && i > 0) {
                x = this.shelf.x - (this.shelf.displayWidth*.9)/2 + ((this.shelf.displayWidth*.9)/config.clothingSettings[this.selectedСlothing].width / 2);
                y += this.shelf.displayHeight*.9/config.clothingSettings[this.selectedСlothing].height;
            }
            this.click_area['bra'].push(this.add.sprite(x, y, 'sprites', 'empty').setAlpha(.001).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .9, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height - 7).setInteractive());
        }

        this.click_area['bra'].forEach(area => {
            this.active_click_area_nums.bra++;
            area.on('pointermove', ()=>{this.addBraInShelf(area)}, this);
        });
    }

    addBraInShelf(area){
        if (this.selectedСlothing) {
            if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings[this.selectedСlothing].nums || this.selectedСlothing !== config.hamperNames[1]) {
                return;
            }
            this.clothing_nums_on[this.selectedСlothing]++;

            this.hampers.forEach(hamper => {
                if (hamper.name === this.selectedСlothing) {
                    let object = hamper.objectsIn.pop();
                    let sprite_frame = object.frame.name;
                    /*
                    if (this.selectedСlothing === 'underpants') {
                        sprite_frame = 'fold_' + sprite_frame;
                    }
                    */
                    let y_gap = 5;
                    this.click_area['bra'].push(this.add.sprite(area.x, area.y - (this.shelf_level['bra'] * y_gap), 'sprites', sprite_frame).setDisplaySize(this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width * .5, this.shelf.displayHeight/config.clothingSettings[this.selectedСlothing].height * .6));
                    let last_elem = this.click_area['bra'][this.click_area['bra'].length-1];
                    if (this.shelf_level['bra'] > 0) {
                        last_elem.setDisplaySize(last_elem.displayWidth * (.065 * this.shelf_level['bra'] + 1), last_elem.displayHeight * (.065 * this.shelf_level['bra'] + 1));
                    }
                    object.destroy();
                    area.destroy();

                    for (let j = 0; j < this.click_area['bra'].length; j++) {
                        if (this.click_area['bra'][j].x === area.x && this.click_area['bra'][j].y === area.y && this.click_area['bra'][j].frame.name === 'empty') {
                            this.click_area['bra'].splice(j, 1);
                        }
                    }

                    this.getPercentOfClothe(this.selectedСlothing);
                }
            });
            this.sounds[this.selectedСlothing].play();
            if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings[this.selectedСlothing].nums) {
                this.sounds.encourage.play();
            }

            if (this.clothing_nums_on[this.selectedСlothing] % (config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines) === 0 && this.clothing_nums_on[this.selectedСlothing] < config.clothingSettings[this.selectedСlothing].nums) {
                this.active_click_area_nums.bra = 0;
                this.shelf_level['bra']++;
                this.addClickAreaBra();
                this.sounds.encourage.play();
            }
        }
        else {
            //стрелочки на корзины
        }
    }

    addClickAreaUnderpants(){
        if ((this.selectedСlothing != config.hamperNames[2]) || !this.shelfActive) {
            return;
        }

        if ((this.click_area['underpants'].length > 0) && (this.click_area['underpants'].length % (config.clothingSettings['underpants'].nums / config.clothingSettings['underpants'].vertical)) !== 0) {
            return;
        }

        if (this.active_click_area_nums.underpants > 0) {
            return;
        }

        if (this.hampers[2].objectsIn <= 0) {
            return;
        }

        let y = this.shelf.y + (this.shelf.displayHeight*.9)/3;
        let x = this.shelf.x - (this.shelf.displayWidth*(.9 + this.shelf_level['underpants'] * .05 ))/2 - (this.shelf.displayWidth*(.9 + this.shelf_level['underpants'] * .05 ))/config.clothingSettings[this.selectedСlothing].width/2;

        for (let i = 0; i < config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines; i++) {
            x += this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width*(.9 + this.shelf_level['underpants'] * .05 );
            if(i%config.clothingSettings[this.selectedСlothing].width === 0 && i > 0) {
                x = this.shelf.x - (this.shelf.displayWidth*(.9 + this.shelf_level['underpants'] * .05 ))/2 + ((this.shelf.displayWidth*(.9 + this.shelf_level['underpants'] * .05 ))/config.clothingSettings[this.selectedСlothing].width / 2);
                y += this.shelf.displayHeight*.9/config.clothingSettings[this.selectedСlothing].height;
            }
            this.click_area['underpants'].push(this.add.sprite(x, y, 'sprites', 'empty').setAlpha(.001).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .9, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height - 7).setInteractive());
        }

        this.click_area['underpants'].forEach(area => {
            this.active_click_area_nums.underpants++;
            area.on('pointermove', ()=>{this.addUnderwearInShelf(area)}, this);
        });
    }

    addUnderwearInShelf(area){
        if (this.selectedСlothing) {
            if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings[this.selectedСlothing].nums || this.selectedСlothing !== config.hamperNames[2]) {
                return;
            }
            this.clothing_nums_on[this.selectedСlothing]++;

            this.hampers.forEach(hamper => {
                if (hamper.name === this.selectedСlothing) {
                    let object = hamper.objectsIn.pop();
                    let sprite_frame = 'fold_' + object.frame.name;
                    let y_gap = 5;
                    this.click_area['underpants'].push(this.add.sprite(area.x, area.y - (this.shelf_level['underpants'] * y_gap) + 2.5, 'sprites', sprite_frame).setDisplaySize(this.shelf.displayWidth/config.clothingSettings[this.selectedСlothing].width * .85, this.shelf.displayHeight/config.clothingSettings[this.selectedСlothing].height * .85));
                    let last_elem = this.click_area['underpants'][this.click_area['underpants'].length-1];
                    if (this.shelf_level['underpants'] > 0) {
                        last_elem.setDisplaySize(last_elem.displayWidth * (.1 * this.shelf_level['underpants'] + 1), last_elem.displayHeight * (.1 * this.shelf_level['underpants'] + 1));
                    }
                    
                    object.destroy();
                    area.destroy();

                    for (let j = 0; j < this.click_area['underpants'].length; j++) {
                        if (this.click_area['underpants'][j].x === area.x && this.click_area['underpants'][j].y === area.y && this.click_area['underpants'][j].frame.name === 'empty') {
                            this.click_area['underpants'].splice(j, 1);
                        }
                    }

                    this.getPercentOfClothe(this.selectedСlothing);
                }
            });
            this.sounds[this.selectedСlothing].play();
            if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings[this.selectedСlothing].nums) {
                this.sounds.encourage.play();
            }

            if (this.clothing_nums_on[this.selectedСlothing] % (config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines) === 0 && this.clothing_nums_on[this.selectedСlothing] < config.clothingSettings[this.selectedСlothing].nums) {
                this.shelf_level['underpants']++;
                this.active_click_area_nums.underpants = 0;
                this.addClickAreaUnderpants();
                this.sounds.encourage.play();
            }
        }
        else {
            //стрелочки на корзины
        }
    }

    openShelf(){
        test = this.click_area;
        if (!this.selectedСlothing || this.selectedСlothing === config.hamperNames[0]) {
            return;
        }

        if (this.shelfActive) {
            this.shelfActive = false;
            this.shelf.destroy();
            this.click_area['bra'].forEach(object => {
                object.setVisible(0);
            });
            this.click_area['underpants'].forEach(object => {
                object.setVisible(0);
            });
        }
        else {
            this.click_area['bra'].forEach(object => {
                object.setVisible(1);
                object.depth++;
            });
            this.click_area['underpants'].forEach(object => {
                object.setVisible(1);
                object.depth++;
            });

            this.shelfActive = true;
            this.shelf = this.add.sprite(config.width/2, this.shelf_area.y - this.shelf_area.displayHeight/2, 'sprites', 'shelf').setScale(.75).setInteractive();

            if (!this.clothing_nums_on[config.hamperNames[1]] || !this.clothing_nums_on[config.hamperNames[2]]) {
                if (this.selectedСlothing === 'bra') {
                    this.addClickAreaBra();
                }
                else if (this.selectedСlothing === 'underpants') {
                    this.addClickAreaUnderpants();
                }
            }
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
