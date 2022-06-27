var config = {
    type: Phaser.AUTO,
    width: 575,
    height: 1080,
    backgroundColor: '#CCC9C9',
    orientation: Phaser.Scale.PORTRAIT, 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    scene: [Preloader, GameScene]
};

var game = new Phaser.Game(config);