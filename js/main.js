const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1080,
    backgroundColor: '#CCC9C9',
    orientation: Phaser.Scale.PORTRAIT, 
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    scene: [Preloader, GameScene],
    hamper: {
      width: 143,
      height: 210,
    },
    hamperNames: ['dress', 'underwear', 'underpants'],
    clothingSettings: { 
      dress: {
        nums: 12
      },
      underwear: {
        nums: 18,
        lines: 3,
      },
      underpants: {
        nums: 32,
        lines: 2
      },
    },
    progresStages: {
			1: .5,
			2: .8,
			3: 1,
		},
};

var game = new Phaser.Game(config);