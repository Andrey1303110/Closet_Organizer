var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1080,
    backgroundColor: '#CCC9C9',
    orientation: Phaser.Scale.PORTRAIT, 
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    scene: [Preloader, GameScene]
};

var game = new Phaser.Game(config);