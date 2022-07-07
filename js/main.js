var store_link = "https://www.google.com/";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: '#CCC9C9',
  orientation: Phaser.Scale.PORTRAIT,
  scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, GameScene],
  closet: {
    width: 315,
  },
  shelf: {
    width: 434.5,
    height: 225,
  },
  finishStars: {
    width: 120,
    height: 115,
  },
  hamper: {
    width: 143,
    height: 210,
  },
  hamperNames: ['dress', 'bra', 'underpants'],
  clothingSettings: { 
    dress: {
      nums: 12,
      percentage: 1.5,
      variables: 1,
    },
    bra: {
      nums: 18,
      width: 3,
      height: 3,
      lines: 2,
      vertical: 3,
      percentage: 2.5,
      variables: 5,
    },
    underpants: {
      nums: 36,
      width: 18,
      height: 3,
      lines: 1,
      vertical: 2,
      percentage: 1.03,
      variables: 4,
    },
  },
  progresStages: {
    1: .5,
    2: .8,
    3: 1,
  },
};

var game = new Phaser.Game(config);