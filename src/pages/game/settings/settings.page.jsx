import { useState } from "react";

import FormSliderInput from "../../../components/form-slider/form-slider.component";
import RadioButton from "../../../components/custom-radio-button/custom-radio-button.component";

import "./settings.styles.css";

function SettingsPage() {
  const [sound, setSound] = useState(50);
  const [gameSound, setGameSound] = useState(50);

  const soundObj = {
    sound: (value) => setSound(value),
    gameSound: (value) => setGameSound(value),
  };

  function handleChange(e) {
    e.preventDefault();

    const { value, name } = e.target;

    soundObj[name](Number(value));
  }

  return (
    <div className="settings-container">
      <div className="card">
        <p className="card-header">Settings</p>
        <div className="card-body">
          <FormSliderInput
            label="sound"
            type="range"
            name="sound"
            min="0"
            max="100"
            value={sound}
            onChange={handleChange}
          />
          <FormSliderInput
            label="Game sound"
            type="range"
            name="gameSound"
            min="0"
            max="100"
            value={gameSound}
            onChange={handleChange}
          />
          <div className="game-mode">
            <p className="settings-label">Game Mode</p>
            <div className="radio-buttons">
              <RadioButton
                label="Staged"
                id="Staged"
                type="radio"
                name="gameMode"
                value="staged"
                checked
              />
              <RadioButton
                label="Timer"
                id="Timer"
                type="radio"
                name="gameMode"
                value="timer"
              />
              <RadioButton
                label="Practice"
                id="Practice"
                type="radio"
                name="gameMode"
                value="practice"
              />
            </div>
          </div>
          <div className="diffculty">
            <p className="settings-label">Difficulty</p>
            <div className="radio-buttons">
              <RadioButton
                label="Easy"
                type="radio"
                id="easy"
                name="difficulty"
                value="easy"
                checked
              />
              <RadioButton
                label="Normal"
                type="radio"
                id="normal"
                name="difficulty"
                value="normal"
              />
              <RadioButton
                label="Hard"
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
