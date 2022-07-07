var test;
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {}

    create() {
        this.createSounds();
        this.setEndpoints();
        this.createBackground();
        this.createLevelText();
        this.start();
        this.addListeners();
    }

    start() {
        this.currentGameProgress = 0;
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
        this.hands = [];
        this.greeting_text = [];
        this.endScreen = {};
        this.createHampers();
        this.addObjectsInHamper();
        this.addClosetClickArea();
        this.addRetryButton();
    }

    restart() {
        this.sounds.button.play();
        this.deleteCompelteBar();
        config.hamperNames.forEach(name => {
            if (this.hands['hamper_' + name]) {
                this.hands['hamper_' + name].destroy();
            }
        });
        if (this.done_button) {
            this.done_button.destroy();
        }
        this.retry_button.x += this.retry_button.displayWidth;
        this.closeShelf();
        if (this.dress_on_hanger) {
            for (let i = 0; i < this.dress_on_hanger.length; i++) {
                this.dress_on_hanger[i].destroy();
            }
        }
        if (this.click_area['dress']) {
            for (let i = 0; i < this.click_area['dress'].length; i++) {
                this.click_area['dress'][i].destroy();
            }
        }
        this.click_area['dress'] = [];
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
        this.closet_area.destroy();
        this.start();
    }

    addListeners() {
        window.addEventListener("orientationchange", () => { this.reinitHUD() });
        window.addEventListener("resize", () => { this.reinitHUD() });
    }

    reinitHUD() {
        this.setEndpoints();
        if (this.statusBar) {
            this.deleteCompelteBar();
            this.createCompleteBar();
            if (this.retry_button) {
                this.retry_button.destroy();
                if (this.done_button) {
                    this.done_button.destroy();
                }
                this.addRetryButton();
                this.showRetryButton();
            }
        }
    };

    addClosetClickArea() {
        this.closet_area = this.add.sprite(config.width / 2, config.height * .4, 'sprites', 'empty').setAlpha(.0001).setDisplaySize(config.closet.width * 1.25, config.height * .75).setInteractive();
        this.closet_area.on('pointerdown', () => {
            this.closet_area.destroy();
            this.hands['initial'].destroy();
            this.hampers.forEach(hamper => {
                hamper.showing_on_screen();
            });
            this.createCompleteBar();
            this.addClickAreaDress();
        }, this);

        this.addInitialHand();
    }

    addInitialHand() {
        let hand = this.add.sprite(config.width / 2, config.height * .35, 'sprites', 'hand').setOrigin(1);
        hand.setDisplaySize(82, 88);
        hand.setPosition(hand.x + hand.displayWidth, hand.y + hand.displayHeight / 2);

        this.createWawingTweens(hand);

        this.hands['initial'] = hand;
    }

    addShelfHand() {
        if (this.hands['shelf']) {
            return;
        }

        config.hamperNames.forEach(name => {
            if (this.hands['clickArea_' + name]) {
                this.hands['clickArea_' + name].destroy();
            }
        });

        let hand = this.add.sprite(config.width / 2, config.height * .35, 'sprites', 'hand').setOrigin(1);
        hand.setDisplaySize(82, 88);
        hand.setPosition(this.shelf_area.x + hand.displayWidth, this.shelf_area.y + hand.displayHeight * .25);

        this.createWawingTweens(hand);

        this.hands['shelf'] = hand;
    }

    addHandOverHamper(hamper) {
        let name = 'hamper_' + hamper.name;
        this.hands[name] = this.add.sprite(0, 0, 'sprites', 'hand').setOrigin(1);
        this.hands[name].depth = hamper.objectsIn[hamper.objectsIn.length - 1].depth + 1;
        this.hands[name].setDisplaySize(82, 88);
        this.hands[name].setPosition(hamper.x + this.hands[name].displayWidth * 1.5, hamper.y - hamper.displayHeight / 2);

        this.createWawingTweens(this.hands[name]);
    }

    addHandOverClickArea(click_area_name, additional = null) {
        config.hamperNames.forEach(name => {
            if (this.hands['clickArea_' + name]) {
                this.hands['clickArea_' + name].destroy();
            }
        });

        let name = 'clickArea_' + click_area_name;

        this.hands[name] = this.add.sprite(0, 0, 'sprites', 'hand').setOrigin(1);
        this.hands[name].setDisplaySize(82, 88);

        if (!additional) {
            this.createSwipingTweens(this.hands[name], this.click_area[click_area_name]);
        } else {
            this.createSwipingAxisTweens(this.hands[name], this.click_area[click_area_name]);
        }
    }

    checkAllDone(hamper) {
        let result = true;
        for (let i = 0; i < this.hampers.length; i++) {
            const elem = this.hampers[i];

            if (elem.objectsIn.length) {
                this.addHandOverHamper(elem);
                if (hamper === elem) {
                    return;
                }
                result = false;
                break;
            }
        }

        if (result) {
            this.done_button.setTexture('sprites', 'btn_bg_done_green')
            this.addHandOverBtn(this.done_button);
        }
    }

    addHandOverBtn(button) {
        if (this.hands[button.name]) {
            this.hands[button.name].destroy();
        }

        this.hands[button.name] = this.add.sprite(button.x - button.displayWidth, button.y + button.displayHeight / 2, 'sprites', 'hand');
        this.hands[button.name].setDisplaySize(82, 88);
        this.hands[button.name].setOrigin(1, 0.5);
        this.hands[button.name].flipX = true;

        this.createWawingTweens(this.hands[button.name], true);
    }

    createWawingTweens(hand, reverse = false) {
        let frames = 999;
        let frame_duration = 585;
        let timeline = this.tweens.createTimeline();

        let cof = 1;
        if (reverse) {
            cof = -1;
        }

        for (let i = 0; i <= frames; i++) {
            if (i === frames) {
                timeline.add({
                    targets: hand,
                    angle: 0,
                    ease: 'Linear',
                    duration: frame_duration,
                });
            }
            else {
                if (i % 2 === 0 || i === 0) {
                    timeline.add({
                        targets: hand,
                        angle: -20 * cof,
                        ease: 'Linear',
                        duration: frame_duration,
                    });
                }
                else {
                    timeline.add({
                        targets: hand,
                        angle: 0,
                        ease: 'Linear',
                        duration: frame_duration,
                    });
                }
            }
        };

        timeline.play();
    }

    createSwipingTweens(hand, click_area) {
        let repeats = 999;
        let frame_duration = 585;
        let timeline = this.tweens.createTimeline();

        let first_x = click_area[0].x + hand.displayWidth;
        let last_x = click_area[click_area.length - 1].x + hand.displayWidth;

        hand.y = click_area[0].y + hand.displayHeight / 2;
        hand.x = first_x;

        for (let i = 0; i <= repeats; i++) {
            timeline.add({
                targets: hand,
                angle: -20,
                ease: 'Linear',
                duration: frame_duration,
            });
            timeline.add({
                targets: hand,
                angle: -20,
                x: last_x,
                ease: 'Linear',
                duration: frame_duration * 4,
                onComplete: () => {
                    hand.setAlpha(0);
                }
            });
            timeline.add({
                targets: hand,
                angle: 0,
                x: first_x,
                ease: 'Linear',
                duration: 3000,
                onComplete: () => {
                    hand.setAlpha(1);
                }
            });
        };

        timeline.play();
    }

    createSwipingAxisTweens(hand, click_area) {
        let repeats = 999;
        let frame_duration = 585;
        let timeline = this.tweens.createTimeline();

        let coordinates = {
            start: {
                x: click_area[0].x + hand.displayWidth,
                y: click_area[0].y + hand.displayHeight / 2,
            },
            end: {
                x: click_area[click_area.length - 1].x + hand.displayWidth,
                y: click_area[0].y + (config.shelf.height / 3) + hand.displayHeight / 2,
            }
        };

        hand.y = coordinates.start.y;
        hand.x = coordinates.start.x;

        for (let i = 0; i <= repeats; i++) {
            timeline.add({
                targets: hand,
                x: coordinates.start.x,
                y: coordinates.start.y,
                angle: -20,
                ease: 'Linear',
                duration: frame_duration,
            });
            timeline.add({
                targets: hand,
                angle: -20,
                x: coordinates.end.x,
                ease: 'Linear',
                duration: frame_duration * 4,
                onComplete: () => {
                    hand.setAlpha(0);
                }
            });
            timeline.add({
                targets: hand,
                angle: 0,
                x: coordinates.start.x,
                y: coordinates.end.y,
                ease: 'Linear',
                duration: 500,
                onComplete: () => {
                    hand.setAlpha(1);
                }
            });


            timeline.add({
                targets: hand,
                angle: -20,
                ease: 'Linear',
                duration: frame_duration,
            });
            timeline.add({
                targets: hand,
                angle: -20,
                x: coordinates.end.x,
                ease: 'Linear',
                duration: frame_duration * 4,
                onComplete: () => {
                    hand.setAlpha(0);
                }
            });
            timeline.add({
                targets: hand,
                x: coordinates.start.x,
                y: coordinates.start.y,
                angle: 0,
                x: coordinates.start.x,
                ease: 'Linear',
                duration: 500,
                onComplete: () => {
                    hand.setAlpha(1);
                }
            });


            timeline.add({
                targets: hand,
                angle: -20,
                ease: 'Linear',
                duration: frame_duration,
            });
            timeline.add({
                targets: hand,
                angle: -20,
                y: coordinates.end.y,
                ease: 'Linear',
                duration: frame_duration,
                onComplete: () => {
                    hand.setAlpha(0);
                }
            });
            timeline.add({
                targets: hand,
                angle: 0,
                x: coordinates.start.x,
                y: coordinates.start.y,
                ease: 'Linear',
                duration: 2500,
                onComplete: () => {
                    hand.setAlpha(1);
                }
            });
        };

        timeline.play();
    }

    addRetryButton() {
        this.retry_button = this.add.sprite(this.screenEndpoints.no_margin_right, config.height * 1 / 3, 'sprites', 'btn_bg_retry').setInteractive().setScale(.5).setOrigin(1, .5);
        this.retry_button.x += this.retry_button.displayWidth;
        this.retry_button.y += this.retry_button.displayHeight / 2;
        this.retry_button.on('pointerdown', this.restart, this);
    }

    showRetryButton() {
        this.retry_button.x = this.screenEndpoints.no_margin_right + this.retry_button.displayWidth;
        this.tweens.add({
            targets: this.retry_button,
            x: this.screenEndpoints.no_margin_right,
            ease: 'Power1',
            duration: 250,
            onComplete: () => {
                this.addDoneButton();
                this.showDoneButton();
            }
        });
    }

    addDoneButton() {
        if (this.done_button) {
            this.done_button.destroy();
        }
        this.done_button = this.add.sprite(this.screenEndpoints.no_margin_right, config.height * 1 / 3, 'sprites', 'btn_bg_done').setInteractive().setScale(.5).setOrigin(1, .5);
        this.done_button.x += this.done_button.displayWidth;
        this.done_button.y -= this.done_button.displayHeight / 2;
        this.done_button.name = 'done_btn';
        this.done_button.on('pointerdown', this.showEndScreen, this);
    }

    showDoneButton() {
        this.done_button.x = this.screenEndpoints.no_margin_right + this.done_button.displayWidth;
        this.tweens.add({
            targets: this.done_button,
            x: this.screenEndpoints.no_margin_right,
            ease: 'Power1',
            duration: 250,
        });
    }

    showEndScreen() {
        this.closeShelf();
        this.endScreen.bg = this.add.sprite(config.width / 2, -config.height, 'gradient_bg').setAlpha(.965).setDepth(99).setInteractive();

        this.tweens.add({
            targets: this.endScreen.bg,
            y: config.height / 2,
            ease: 'Power2',
            duration: 750,
            onComplete: () => {
                this.addFinishCloset();
            }
        });
    }

    addFinishCloset() {
        this.endScreen.closet = this.add.sprite(config.width / 2, config.height / 2, 'sprites', 'finish_closet').setScale(2 / 3).setInteractive();
        this.endScreen.closet.depth = this.endScreen.bg.depth;
        this.endScreen.stars = [];

        this.endScreen.stars[1] = this.add.sprite(config.width / 2 - config.finishStars.width * 1.35, config.height * .2, 'sprites', 'bigstar').setDisplaySize(config.finishStars.width, config.finishStars.height).setDepth(this.endScreen.bg.depth);
        this.endScreen.stars[2] = this.add.sprite(config.width / 2, config.height * .2 - config.finishStars.height, 'sprites', 'bigstar').setDisplaySize(config.finishStars.width, config.finishStars.height).setDepth(this.endScreen.bg.depth);
        this.endScreen.stars[3] = this.add.sprite(config.width / 2 + config.finishStars.width * 1.35, config.height * .2, 'sprites', 'bigstar').setDisplaySize(config.finishStars.width, config.finishStars.height).setDepth(this.endScreen.bg.depth);

        this.setFinishProgress();
    }

    addButtonPlayNow() {
        let btn_width = screen.width * 3 / 4;
        let font_cof = 1.5;
        if (screen.width > 480) {
            btn_width = 480;
            font_cof = 2;
        }
        let btn_height = btn_width / 3.15;
        this.playNowButton = this.add.sprite(config.width / 2, this.endScreen.closet.y + this.endScreen.closet.displayHeight, 'sprites', 'playNowButton').setDisplaySize(btn_width, btn_height).setDepth(this.endScreen.bg.depth).setInteractive();
        this.playNowButton.on('pointerdown', (e) => { 
            window.open(store_link, '_self') }, this);
        this.playNowButton.text = this.add.text(this.playNowButton.x, this.playNowButton.y, 'PLAY NOW', {
            font: `${btn_height / font_cof}px Sublima-ExtraBold`,
            fill: '#fff',
        }).setOrigin(0.5).setDepth(this.endScreen.bg.depth).setScale(this.playNowButton.scale);

        let timeline = this.tweens.createTimeline();
        for (let i = 0; i < 99; i++) {
            timeline.add({
                targets: [this.playNowButton, this.playNowButton.text],
                ease: 'Linear',
                scale: this.playNowButton.scale + .08,
                duration: 400,
            });
            timeline.add({
                targets: [this.playNowButton, this.playNowButton.text],
                scale: this.playNowButton.scale - .08,
                ease: 'Linear',
                duration: 400,
            });
        }
        timeline.play();
    }

    starAnimation(star, num) {
        let delay = num * 250;
        let timeline = this.tweens.createTimeline();

        timeline.add({
            targets: star,
            delay: delay,
            ease: 'Power3',
            scale: star.scale * .75,
            duration: 325,
            onComplete: () => {
                star.setTexture('sprites', 'bigstar_active');
                this.sounds.star.play();
            }
        });
        timeline.add({
            targets: star,
            scale: star.scale * 1.25,
            ease: 'Power3',
            duration: 450,
        });
        timeline.add({
            targets: star,
            scale: star.scale * 1,
            ease: 'Power3',
            duration: 325,
            onComplete: () => {
                if (this.currentGameProgress >= 100 && !this.sounds.fireworks.isPlaying) {
                    this.sounds.fireworks.play();
                }
            }
        });

        timeline.play();
    }

    setFinishStars() {
        if (this.currentGameProgress >= config.progresStages[1] * 100) {
            this.starAnimation(this.endScreen.stars[1], 1);
            if (this.currentGameProgress >= config.progresStages[2] * 100) {
                this.starAnimation(this.endScreen.stars[2], 2);
                if (this.currentGameProgress >= config.progresStages[3] * 100) {
                    this.starAnimation(this.endScreen.stars[3], 3);
                }
            }
        }
    }

    setFinishProgress() {
        for (let i = 1; i <= 3; i++) {
            this.endScreen.stars[i].setTexture('sprites', 'bigstar');
        }

        this.endScreen.waves = this.add.sprite(config.width / 2, this.endScreen.closet.y + this.endScreen.closet.displayHeight * .42, 'sprites', 'waves_top').setScale(.665).setDepth(this.endScreen.bg.depth).setOrigin(.5, 1);
        this.endScreen.waves_texture = this.add.sprite(config.width / 2, this.endScreen.closet.y + this.endScreen.closet.displayHeight * .42, 'sprites', 'waves_texture').setDepth(this.endScreen.bg.depth).setOrigin(.5, 1);

        let last_y = this.endScreen.waves.y;
        let new_y = Math.floor(this.endScreen.waves.y - ((this.currentGameProgress / 100) * ((this.endScreen.closet.displayHeight * .58) + this.endScreen.waves.displayHeight * 1.5)));

        this.endScreen.waves_texture.setDisplaySize(this.endScreen.waves.displayWidth, this.endScreen.waves.displayHeight / 2);

        let scaleY = ((last_y - new_y) / this.endScreen.waves_texture.displayHeight) * this.endScreen.waves_texture.scaleY;

        let animDuration = this.sounds.progress.duration * this.currentGameProgress / 100 * 1000;

        this.anims.create(
            {
                key: 'live_waves',
                frames: [
                    { key: 'sprites', frame: 'wave1' },
                    { key: 'sprites', frame: 'wave2' },
                    { key: 'sprites', frame: 'wave3' },
                    { key: 'sprites', frame: 'wave4' },
                    { key: 'sprites', frame: 'wave5' },
                    { key: 'sprites', frame: 'wave6' },
                    { key: 'sprites', frame: 'wave7' },
                ],
                frameRate: 10,
                repeat: -1
            });

        this.endScreen.waves.anims.play("live_waves");

        this.sounds.progress.play();

        this.tweens.add({
            targets: this.endScreen.waves,
            y: new_y,
            ease: 'Linear',
            duration: animDuration,
        });

        this.tweens.add({
            targets: this.endScreen.waves_texture,
            scaleY: scaleY,
            ease: 'Linear',
            duration: animDuration,
            onComplete: () => {
                this.sounds.progress.stop();
                this.setFinishStars();
                setTimeout(() => { this.addButtonPlayNow() }, 750);
            }
        });

        this.endScreen.text = {
            up: this.add.text(config.width / 2, this.endScreen.closet.y - this.endScreen.closet.displayHeight * .15, Math.floor(this.currentGameProgress) + '%', {
                font: '56px Sublima-Light',
                fill: '#fff',
            }).setOrigin(0.5).setDepth(this.endScreen.bg.depth),
            down: this.add.text(config.width / 2, this.endScreen.closet.y, 'ACCURACY', {
                font: '17px Sublima-ExtraBold',
                fill: '#fff',
            }).setOrigin(0.5).setDepth(this.endScreen.bg.depth),
        };
    }

    createSounds() {
        this.sounds = {
            basketup: this.sound.add('basketup', { volume: 0.5 }),
            shelf: this.sound.add('shelf', { volume: 0.5 }),
            dress_on: this.sound.add('dress_on'),
            encourage: this.sound.add('encourage'),
            bra: this.sound.add('bra'),
            underpants: this.sound.add('underpants'),
            fireworks: this.sound.add('fireworks'),
            button: this.sound.add('button'),
            progress: this.sound.add('progress'),
            star: this.sound.add('star'),
            theme: this.sound.add('theme', { volume: 0.25 }),
        }
        this.sounds.theme.loop = true;
    }

    setEndpoints() {
        if (screen.width >= screen.height) {
            if (screen.width / screen.height < 16 / 9) {
                this.screenEndpoints = {
                    left: (config.width / 2) - screen.width / 2 * (config.height / window.innerHeight) + (screen.width * .06),
                    right: (config.width / 2) + screen.width / 2 * (config.height / window.innerHeight) - (screen.width * .06),
                    no_margin_left: (config.width / 2) - screen.width / 2 * (config.height / window.innerHeight),
                    no_margin_right: (config.width / 2) + screen.width / 2 * (config.height / window.innerHeight),
                };
            }
            else {
                this.screenEndpoints = {
                    left: (config.width * .075),
                    right: config.width - (config.width * .075),
                    no_margin_left: 0,
                    no_margin_right: config.width,
                };
            }
        }
        else {
            this.screenEndpoints = {
                left: (config.width / 2) - screen.width / 2 * (config.height / window.innerHeight) + (screen.width * .06),
                right: (config.width / 2) + screen.width / 2 * (config.height / window.innerHeight) - (screen.width * .06),
                no_margin_left: (config.width / 2) - screen.width / 2 * (config.height / window.innerHeight),
                no_margin_right: (config.width / 2) + screen.width / 2 * (config.height / window.innerHeight),
            };
        }
    }

    createBackground() {
        this.sceneBG = this.add.sprite(config.width / 2, config.height / 2, 'sprites', 'scene_bg');

        let scaleX = this.cameras.main.width / this.sceneBG.width;
        let scaleY = this.cameras.main.height / this.sceneBG.height;
        let scale = Math.max(scaleX, scaleY);
        this.sceneBG.setScale(scale).setScrollFactor(0);
    }

    createLevelText() {
        this.add.text(config.width / 2, 75, 'Level 1', {
            font: '32px sans-serif',
            fill: '#fff',
        }).setOrigin(0.5);
    }

    createHampers() {
        this.hampers = [];
        for (let i = 0; i < 3; i++) {
            this.hampers.push(new Hamper(this, i, config.hamperNames[i]));
        }

        for (let i = 0; i < this.hampers.length; i++) {
            this.hampers[i].add_additional_images(i);

            this.hampers[i].on('pointerdown', () => {
                this.hampers[i].selecting();

                config.hamperNames.forEach(name => {
                    if (this.hands['hamper_' + name]) {
                        this.hands['hamper_' + name].destroy();
                    }
                });

                if (i === 0) {
                    if (this.hampers[0].isActive && this.hampers[0].objectsIn.length) {
                        this.addHandOverClickArea(this.hampers[0].name);
                    }
                }
                else {
                    if (this.hampers[i].isActive && this.hampers[i].objectsIn.length && !this.shelf) {
                        this.addShelfHand();
                    }
                }
            });
            this.hampers[0].on('pointerdown', () => {
                this.closeShelf();
                this.hands['hamper_dress'].destroy();
            }, this);
            this.hampers[1].on('pointerdown', this.addClickAreaBra, this);
            this.hampers[2].on('pointerdown', this.addClickAreaUnderpants, this);
        }
    }

    createCompleteBar() {
        this.statusBar = this.add.sprite(this.screenEndpoints.left - window.innerWidth / 2, config.height * .3, 'sprites', 'statusBarEmpty').setScale(.75);
        this.statusBar.alpha = 0.68;

        this.statusBarComplete = this.add.sprite(this.screenEndpoints.left - window.innerWidth / 2, config.height * .3, 'sprites', 'statusBarComplete').setScale(.75);
        this.statusBarComplete.flipY = true;
        this.statusBarComplete.frame.cutHeight = 0;
        this.statusBarComplete.frame.updateUVs();

        this.progressArrow = this.add.sprite(this.statusBar.x + this.statusBar.displayWidth - this.statusBar.displayWidth * .15, this.statusBar.y + this.statusBar.displayHeight / 2, 'sprites', 'progressArrow').setDisplaySize(15, 16).setOrigin(1, 0.5);

        this.statusBarStars = [];
        for (let i = 1; i <= 3; i++) {
            this.statusBarStars[i] = this.add.sprite(this.screenEndpoints.left - window.innerWidth / 2, this.statusBar.y - (this.statusBar.displayHeight / 2) + (this.statusBar.displayHeight * (1 - config.progresStages[i])), 'sprites', 'star').setDisplaySize(this.statusBar.displayWidth * 1.25, this.statusBar.displayWidth * 1.1);
        }

        this.tweens.add({
            targets: this.statusBar,
            x: this.statusBar.x + window.innerWidth / 2,
            ease: 'Power1',
            duration: 250,
        });
        this.tweens.add({
            targets: this.statusBarComplete,
            x: this.statusBarComplete.x + window.innerWidth / 2,
            ease: 'Power1',
            duration: 250,
        });
        this.tweens.add({
            targets: this.progressArrow,
            x: this.progressArrow.x + window.innerWidth / 2,
            ease: 'Power1',
            duration: 250,
        });
        this.tweens.add({
            targets: this.statusBarStars,
            x: this.statusBarStars[1].x + window.innerWidth / 2,
            ease: 'Power1',
            duration: 250,
        });

        this.updateBar(this.currentGameProgress);
    }

    deleteCompelteBar() {
        this.statusBar.destroy();
        this.statusBarComplete.destroy();
        this.progressArrow.destroy();
        this.statusBarStars.forEach(star => {
            star.destroy();
        });
    }

    updateBar(value) {
        if (value > 100) {
            value = 100;
        }
        else if (value < 0) {
            value = 0;
        }

        let all_height = this.statusBar.displayHeight;
        let one_percent = all_height / 100;
        let new_value = one_percent * value;
        this.statusBarComplete.frame.cutHeight = new_value / 75 * 100;
        this.statusBarComplete.frame.updateUVs();
        this.progressArrow.y = this.statusBar.y + this.statusBar.displayHeight / 2 - new_value;

        for (let i = 1; i <= 3; i++) {
            this.statusBarStars[i].setTexture('sprites', 'star');
        }

        if (this.currentGameProgress >= config.progresStages[1] * 100) {
            this.statusBarStars[1].setTexture('sprites', 'star_active');
            if (this.currentGameProgress >= config.progresStages[2] * 100) {
                this.statusBarStars[2].setTexture('sprites', 'star_active');
                if (this.currentGameProgress >= config.progresStages[3] * 100) {
                    this.statusBarStars[3].setTexture('sprites', 'star_active');
                }
            }
        }
    }

    getPercentOfClothe(clothe) {
        this.currentGameProgress += config.clothingSettings[clothe].percentage;
        this.updateBar(this.currentGameProgress);
    }

    generateRandom(min, max) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.round(rand * difference);
        rand = rand + min;
        return rand;
    }

    addObjectsInHamper() {
        this.hampers.forEach(hamper => {
            hamper.objectsIn = [];
            let step;
            let scale_cof;
            switch (hamper.name) {
                case 'dress':
                    step = 6;
                    scale_cof = 1 / 33;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = hamper.name + '_fold';
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * scale_cof, hamper.x + hamper.x * scale_cof), hamper.y - hamper.displayHeight + 107 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(hamper.displayWidth - hamper.displayWidth * .4, hamper.displayWidth - hamper.displayWidth * .25,).setAngle(this.generateRandom(-25, 25));
                    }

                    break;
                case 'bra':
                    step = 7;
                    scale_cof = 1 / 50;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = hamper.name + '_' + (i % config.clothingSettings[hamper.name].variables);
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * scale_cof, hamper.x + hamper.x * scale_cof), hamper.y - hamper.displayHeight + 133 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(100, 50).setAngle(this.generateRandom(-15, 15));
                    }
                    break;
                case 'underpants':
                    step = 3.5;
                    scale_cof = 1 / 33;
                    for (let i = 0; i < config.clothingSettings[hamper.name].nums; i++) {
                        let sprite_name = 'underpants_' + (i % config.clothingSettings[hamper.name].variables);
                        hamper.objectsIn[i] = this.add.sprite(this.generateRandom(hamper.x - hamper.x * scale_cof, hamper.x + hamper.x * scale_cof), hamper.y - hamper.displayHeight + 137 - (this.generateRandom(0, step) * i), 'sprites', sprite_name).setDisplaySize(81, 42).setAngle(this.generateRandom(-40, 40));
                    }
                    break;
            }
        });
    }

    addClickAreaDress() {
        this.sounds.theme.play();
        for (let i = 0; i < config.clothingSettings.dress.nums; i++) {
            this.click_area['dress'].push(this.add.sprite(config.width / 2 - config.closet.width / 2 + config.closet.width / config.clothingSettings.dress.nums * i + config.closet.width / config.clothingSettings.dress.nums / 2, config.height * .37, 'sprites', 'empty').setAlpha(.0001).setDisplaySize(config.closet.width / config.clothingSettings.dress.nums, config.height * .4).setInteractive());
        }

        this.click_area['dress'].forEach(area => {
            area.on('pointerdown', () => { this.addDressInCloset(area) }, this);
            area.on('pointermove', () => { this.addDressInCloset(area) }, this);
        });

        this.dress_on_hanger = [];

        this.shelf_area = this.add.sprite(config.width / 2, config.height * .65, 'sprites', 'empty').setAlpha(.0001).setDisplaySize(config.closet.width, 150).setInteractive();
        this.shelf_area.on('pointerdown', this.openShelf, this);
    }

    addDressInCloset(area) {
        if (this.hands['clickArea_dress']) {
            this.hands['clickArea_dress'].destroy();
        }

        if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings.dress.nums || this.selectedСlothing !== 'dress') {
            return;
        }
        this.clothing_nums_on[this.selectedСlothing]++;
        if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings.dress.nums) {
            this.sounds.encourage.play();
            this.addGreetingText(area);
        }
        this.sounds.dress_on.play();
        this.dress_on_hanger.push(this.add.sprite(area.x, 367, 'sprites', 'dress_on_hanger').setDisplaySize(27, 460));
        this.hampers.forEach(hamper => {
            if (hamper.name === this.selectedСlothing) {
                hamper.objectsIn.pop().destroy();
                if (hamper.objectsIn.length === 0) {
                    hamper.shakes();
                    this.checkAllDone(hamper);
                }
            }
        });
        area.removeInteractive();

        this.getPercentOfClothe(this.selectedСlothing);
    }

    addClickAreaBra() {
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

        let y = this.shelf.y - (this.shelf.displayHeight * .9) / 2 + this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height / 2;
        let x = this.shelf.x - (this.shelf.displayWidth * .9) / 2 - (this.shelf.displayWidth * .9) / config.clothingSettings[this.selectedСlothing].width / 2;

        for (let i = 0; i < config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines; i++) {
            x += this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .9;
            if (i % config.clothingSettings[this.selectedСlothing].width === 0 && i > 0) {
                x = this.shelf.x - (this.shelf.displayWidth * .9) / 2 + ((this.shelf.displayWidth * .9) / config.clothingSettings[this.selectedСlothing].width / 2);
                y += this.shelf.displayHeight * .9 / config.clothingSettings[this.selectedСlothing].height;
            }
            this.click_area['bra'].push(this.add.sprite(x, y, 'sprites', 'empty').setAlpha(.001).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .9, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height - 7).setInteractive());
        }

        this.click_area['bra'].forEach(area => {
            this.active_click_area_nums.bra++;
            area.on('pointermove', () => { this.addBraInShelf(area) }, this);
        });

        if (!this.hands.clickArea_bra) {
            this.addHandOverClickArea('bra', true);
        }
    }

    addBraInShelf(area) {
        config.hamperNames.forEach(name => {
            if (this.hands['clickArea_' + name]) {
                this.hands['clickArea_' + name].destroy();
            }
        });

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
                    let y_gap = 7;
                    this.click_area['bra'].push(this.add.sprite(area.x, area.y - (this.shelf_level['bra'] * y_gap), 'sprites', sprite_frame).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .68, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height * .7));
                    let last_elem = this.click_area['bra'][this.click_area['bra'].length - 1];
                    if (this.shelf_level['bra'] > 0) {
                        last_elem.setDisplaySize(last_elem.displayWidth * (.065 * this.shelf_level['bra'] + 1), last_elem.displayHeight * (.065 * this.shelf_level['bra'] + 1));
                    }
                    last_elem.depth = this.clothing_nums_on.bra;
                    object.destroy();
                    area.destroy();

                    for (let j = 0; j < this.click_area['bra'].length; j++) {
                        if (this.click_area['bra'][j].x === area.x && this.click_area['bra'][j].y === area.y && this.click_area['bra'][j].frame.name === 'empty') {
                            this.click_area['bra'].splice(j, 1);
                        }
                    }

                    if (hamper.objectsIn.length === 0) {
                        hamper.shakes();
                        this.checkAllDone(hamper);
                    }

                    this.getPercentOfClothe(this.selectedСlothing);
                }
            });
            this.sounds[this.selectedСlothing].play();
            if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings[this.selectedСlothing].nums) {
                this.sounds.encourage.play();
                this.addGreetingText(area);
            }

            if (this.clothing_nums_on[this.selectedСlothing] % (config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines) === 0 && this.clothing_nums_on[this.selectedСlothing] < config.clothingSettings[this.selectedСlothing].nums) {
                this.active_click_area_nums.bra = 0;
                this.shelf_level['bra']++;
                this.addClickAreaBra();
                this.sounds.encourage.play();
                this.addGreetingText(area);
            }
        }
        else {
            addArrows([this.hampers[1]]);
        }
    }

    addClickAreaUnderpants() {
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

        let y = this.shelf.y + (this.shelf.displayHeight * .9) / 3;
        let x = this.shelf.x - (this.shelf.displayWidth * (.9 + this.shelf_level['underpants'] * .05)) / 2 - (this.shelf.displayWidth * (.9 + this.shelf_level['underpants'] * .05)) / config.clothingSettings[this.selectedСlothing].width / 2;

        for (let i = 0; i < config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines; i++) {
            x += this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * (.9 + this.shelf_level['underpants'] * .05);
            if (i % config.clothingSettings[this.selectedСlothing].width === 0 && i > 0) {
                x = this.shelf.x - (this.shelf.displayWidth * (.9 + this.shelf_level['underpants'] * .05)) / 2 + ((this.shelf.displayWidth * (.9 + this.shelf_level['underpants'] * .05)) / config.clothingSettings[this.selectedСlothing].width / 2);
                y += this.shelf.displayHeight * .9 / config.clothingSettings[this.selectedСlothing].height;
            }
            this.click_area['underpants'].push(this.add.sprite(x, y, 'sprites', 'empty').setAlpha(.001).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .9, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height - 7).setInteractive());
        }

        this.click_area['underpants'].forEach(area => {
            this.active_click_area_nums.underpants++;
            area.on('pointermove', () => { this.addUnderpantsInShelf(area) }, this);
        });

        if (!this.hands.clickArea_underpants) {
            this.addHandOverClickArea('underpants');
        }
    }

    addUnderpantsInShelf(area) {
        this.hands['clickArea_underpants'].destroy();
        if (this.selectedСlothing) {
            if (this.clothing_nums_on[this.selectedСlothing] >= config.clothingSettings[this.selectedСlothing].nums || this.selectedСlothing !== config.hamperNames[2]) {
                return;
            }
            this.clothing_nums_on[this.selectedСlothing]++;

            this.hampers.forEach(hamper => {
                if (hamper.name === this.selectedСlothing) {
                    let object = hamper.objectsIn.pop();
                    let sprite_frame = 'fold_' + object.frame.name;
                    let y_gap = 5.5;
                    this.click_area['underpants'].push(this.add.sprite(area.x, area.y - (this.shelf_level['underpants'] * y_gap) + 2.5, 'sprites', sprite_frame).setDisplaySize(this.shelf.displayWidth / config.clothingSettings[this.selectedСlothing].width * .86, this.shelf.displayHeight / config.clothingSettings[this.selectedСlothing].height * .72));
                    let last_elem = this.click_area['underpants'][this.click_area['underpants'].length - 1];
                    if (this.shelf_level['underpants'] > 0) {
                        last_elem.setDisplaySize(last_elem.displayWidth * (.1 * this.shelf_level['underpants'] + 1), last_elem.displayHeight * (.1 * this.shelf_level['underpants'] + 1));
                    }
                    last_elem.depth = this.clothing_nums_on.underpants;
                    object.destroy();
                    area.destroy();

                    for (let j = 0; j < this.click_area['underpants'].length; j++) {
                        if (this.click_area['underpants'][j].x === area.x && this.click_area['underpants'][j].y === area.y && this.click_area['underpants'][j].frame.name === 'empty') {
                            this.click_area['underpants'].splice(j, 1);
                        }
                    }

                    if (hamper.objectsIn.length === 0) {
                        hamper.shakes();
                        this.checkAllDone(hamper);
                    }

                    this.getPercentOfClothe(this.selectedСlothing);
                }
            });
            this.sounds[this.selectedСlothing].play();
            if (this.clothing_nums_on[this.selectedСlothing] === config.clothingSettings[this.selectedСlothing].nums) {
                this.sounds.encourage.play();
                this.addGreetingText(area);
            }

            if (this.clothing_nums_on[this.selectedСlothing] % (config.clothingSettings[this.selectedСlothing].width * config.clothingSettings[this.selectedСlothing].lines) === 0 && this.clothing_nums_on[this.selectedСlothing] < config.clothingSettings[this.selectedСlothing].nums) {
                this.shelf_level['underpants']++;
                this.active_click_area_nums.underpants = 0;
                this.addClickAreaUnderpants();
                this.sounds.encourage.play();
                this.addGreetingText(area);
            }
        }
        else {
            addArrows([this.hampers[2]]);
        }
    }

    closeShelf() {
        if (!this.shelf) {
            return;
        }

        config.hamperNames.forEach(name => {
            if (this.hands['clickArea_' + name]) {
                this.hands['clickArea_' + name].destroy();
            }
        });

        this.shelfActive = false;
        this.shelf.destroy();
        this.click_area['bra'].forEach(object => {
            object.setVisible(0);
        });
        this.click_area['underpants'].forEach(object => {
            object.setVisible(0);
        });
    }

    openShelf() {
        if (this.hands['shelf']) {
            this.hands['shelf'].destroy();
        }

        if (!this.selectedСlothing || this.selectedСlothing === config.hamperNames[0]) {
            return;
        }

        if (this.shelfActive) {
            this.closeShelf();
        }

        else {
            this.shelfActive = true;
            this.shelf = this.add.sprite(config.width / 2, this.shelf_area.y - config.shelf.height / 2, 'sprites', 'shelf').setDisplaySize(config.shelf.width, config.shelf.height).setInteractive();

            if (!this.clothing_nums_on[config.hamperNames[1]] || !this.clothing_nums_on[config.hamperNames[2]]) {
                if (this.selectedСlothing === 'bra') {
                    this.addClickAreaBra();
                }
                else if (this.selectedСlothing === 'underpants') {
                    this.addClickAreaUnderpants();
                }
            }

            this.click_area['bra'].forEach(object => {
                object.setVisible(1);
                object.depth = this.shelf.depth + 1;
            });
            this.click_area['underpants'].forEach(object => {
                object.setVisible(1);
                object.depth = this.shelf.depth + 1;
            });
        }
        this.sounds.shelf.play();
    }

    addGreetingText(click_area) {
        let num = this.generateRandom(1, 5);
        let angle = this.generateRandom(-15, 15);
        let coordinates = {
            x: config.width / 2,
            y: 0,
        };
        if (click_area.displayHeight > config.height * 1 / 3) {
            coordinates.y = click_area.y - click_area.displayHeight * 2 / 3;
        }
        else {
            coordinates.y = this.shelf.y - this.shelf.displayHeight;
        }

        this.greeting_text.push(this.add.sprite(coordinates.x, coordinates.y, 'sprites', 'text_' + num).setScale(.25));
        let last_elem = this.greeting_text[this.greeting_text.length - 1];
        last_elem.depth = this.clothing_nums_on[this.selectedСlothing] * 2;

        let timeline = this.tweens.createTimeline();

        timeline.add({
            targets: last_elem,
            scale: .6,
            ease: 'Power2',
            duration: 550,
        });
        timeline.add({
            targets: last_elem,
            angle: angle,
            ease: 'Linear',
            duration: 475,
        });
        timeline.add({
            targets: last_elem,
            angle: angle * -1,
            alpha: 0,
            ease: 'Linear',
            duration: 475,
            onComplete: () => {
                last_elem.destroy();
            }
        });

        timeline.play();
    }
}
