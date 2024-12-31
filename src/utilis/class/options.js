class Options {
  constructor(soundVolume, gameSoundVolume, gameMode) {
    this.soundVolume = soundVolume;
    this.gameSoundVolume = gameSoundVolume;
    this.gameMode = gameMode;
  }

  getSoundVolume() {
    return this.soundVolume;
  }

  getGameSoundVolume() {
    return this.gameSoundVolume;
  }
  getGameMode() {
    return this.gameMode.type;
  }

  timeInterval() {
    const difficulty = this.gameMode.difficulty;
    if (difficulty === "easy") return 2000;
    else if (difficulty === "normal") return 1500;
    else return 1000;
  }
}
