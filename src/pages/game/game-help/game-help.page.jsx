import "./game-help.styles.css";

function HelpPage() {
  return (
    <div className="highscore-menu">
      <div className="card">
        <p className="card-header">Help</p>
        <div className="card-body">
          <div className="sub-card">
            <p className="sub-card-header">CONTROLLS</p>
            <div className="sub-card-body">
              <div className="helps">
                <div>
                  <span className="type">esc</span>
                  <span className="value">to pause the game</span>
                </div>
                <div>
                  <span className="type">Arrow keys</span>
                  <span className="value">to move around the menus</span>
                </div>
                <div>
                  <span className="type">Enter</span>
                  <span className="value">to confirm selection</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-card">
            <p className="sub-card-header">GAME MODE</p>
            <div className="sub-card-body">
              <div className="highscore-type">Level-based mode</div>
              <div className="helps">
                <div>
                  <span className="type">
                    - Progress through increasing difficulty levels
                  </span>
                </div>
                <div>
                  <span className="type">- Mistakes reduce your chances.</span>
                </div>
              </div>
              <div className="highscore-type">Timer-Based Mode</div>
              <div className="helps">
                <div>
                  <span className="type">
                    - Limited time to score as high as possible
                  </span>
                </div>
                <div>
                  <span className="type">
                    - Mistakes reduce your remaining time.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
