export default {
  models: {
    invader1: 'assets/models/invader1.babylon',
    invader2: 'assets/models/invader2.babylon',
    invader3: 'assets/models/invader3.babylon',
    motherShip: 'assets/models/motherShip.babylon',
    defender: 'assets/models/defender.babylon',
    bunker: 'assets/models/bunker.babylon',
  },
  sounds: {
    shoot: 'assets/sounds/shoot.wav',
    invaderKilled: 'assets/sounds/invaderKilled.wav',
    explosion: 'assets/sounds/explosion.wav',
    fastInvader1: 'assets/sounds/fastInvader1.wav',
    fastInvader2: 'assets/sounds/fastInvader2.wav',
    fastInvader3: 'assets/sounds/fastInvader3.wav',
    fastInvader4: 'assets/sounds/fastInvader4.wav',
    ufoHighpitch: 'assets/sounds/ufoHighpitch.wav'
  },
  starfield: {
    numberOfStars: 500,
    numberofStars: 500,
    speed: 0.5
  },
  game: {
    initialLives: 3,
    initialLevel: 1,
    levelText: "LEVEL"
  },
  defender: {
    speed: 1,
    lives: 3
  },
  aliens: {
    interval: 1000,
    speed: 1,
    rows: 5,
    columns: 11
  },
  motherShip: {
    interval: 10000
  },
  oldSchoolEffects: {
    enabled: false
  },
  actionCam: false
}
