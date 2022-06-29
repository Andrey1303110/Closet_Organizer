class Hamper extends Phaser.GameObjects.Sprite {
    constructor(scene, num, name){
        super(scene, config.width/2, config.height, 'sprites', 'hamper_' + num);
        this.scene = scene;
        this.number = num;
        this.name = name;
        this.isActive = false;
        this.setOrigin(0.5, 1);
        this.setDisplaySize(config.hamper.width, config.hamper.height);
        this.scene.add.existing(this);
        this.setInteractive();
    }

    add_additional_images(hamper_num) {
        this.scene.hampers[hamper_num].additional_images = this.scene.add.sprite(this.scene.hampers[hamper_num].x, this.scene.hampers[hamper_num].y - this.scene.hampers[hamper_num].displayHeight, 'sprites', 'additional_' + hamper_num).setScale(.65).setOrigin(.5, 1);
    }

    /*
    move(params){
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            ease: 'Power1',
            delay: params.delay,
            duration: 350,
            onComplete: () => {
                if (params.callback) {
                    params.callback();
                }
            }
        });
    }

    flip(){
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                this.show();
            }
        });
    }
    show(){
        let texture = this.opened ? `card${this.value}` : 'card';
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150,
        });
    }

    open(){
        this.opened = true;
        this.flip();
    }
    close(){
        if (this.opened) {
            this.opened = false;
            this.flip();
        }
    }
    */
}
