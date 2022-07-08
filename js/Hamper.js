class Hamper extends Phaser.GameObjects.Sprite {
    constructor(scene, num, name){
        super(scene, config.width/2, config.height + config.height/2, 'hamper_' + num);
        this.scene = scene;
        this.number = num;
        this.name = name;
        this.isActive = false;
        this.setOrigin(0.5, 1);
        this.setDisplaySize(config.hamper.width, config.hamper.height);
        this.scene.add.existing(this);
        this.setPositions(num);
        this.setInteractive();
    }

    add_additional_images(hamper_num) {
        this.scene.hampers[hamper_num].additional_images = this.scene.add.sprite(this.scene.hampers[hamper_num].x, this.scene.hampers[hamper_num].y - this.scene.hampers[hamper_num].displayHeight, 'additional_' + hamper_num).setScale(.65).setOrigin(.5, 1);
    }

    setPositions(hamper_num){
        if (hamper_num === 0) {
            this.setPosition(this.x - config.hamper.width, this.y);
        }
        else if (hamper_num === 2) {
            this.setPosition(this.x + config.hamper.width, this.y);
        }
    }

    selecting(){
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
    }

    showing_on_screen(){
        this.scene.tweens.add({
            targets: this,
            y: this.y - config.height/2,
            ease: 'Power1',
            duration: 700,
            onComplete: () => {
                if (this.number === 0) {
                    this.scene.addHandOverHamper(this);
                }
            }
        });
        this.scene.tweens.add({
            targets: this.additional_images,
            y: this.y - config.height/2 - config.hamper.height,
            ease: 'Power1',
            duration: 700,
        });

        this.objectsIn.forEach(object => {
            this.scene.tweens.add({
                targets: object,
                y: object.y - config.height/2,
                ease: 'Power1',
                duration: 700,
                onComplete: ()=>{
                    this.scene.showRetryButton();
                }
            }); 
        });
    }

    shakes(){
        let x = this.x;
        let frames = 9;
        let gap = 6;
        let frame_duration = 23;
        let timeline = this.scene.tweens.createTimeline();

        for (let i = 0; i <= frames; i++) {
            if (i === 0) {
                timeline.add({
                    targets: this,
                    delay: 250,
                    x: x - gap/2,
                    angle: 0,
                    ease: 'Power3',
                    duration: frame_duration,
                });
            }
            else if (i === frames) {
                timeline.add({
                    targets: this,
                    x: x,
                    angle: 0,
                    ease: 'Power3',
                    duration: frame_duration,
                });
            }
            else {
                if (i % 2 === 0) {
                    timeline.add({
                        targets: this,
                        x: x - gap,
                        angle: 3.5, 
                        ease: 'Power3',
                        duration: frame_duration,
                    });
                }
                else {
                    timeline.add({
                        targets: this,
                        x: x + gap,
                        angle: -3.5, 
                        ease: 'Power3',
                        duration: frame_duration,
                    });
                }
            }
        };

        timeline.play();
    }
}
