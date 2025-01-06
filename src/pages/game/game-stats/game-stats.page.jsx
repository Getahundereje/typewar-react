import "./game-stats.styles.css";

function StatsPage() {
  return (
    <div className="highscore-menu">
      <div className="card">
        <p className="card-header">Highscore</p>
        <div className="card-body">
          <div className="sub-card">
            <p className="sub-card-header">Single Player</p>
            <div className="sub-card-body">
              <div className="highscore-type">Staged</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value easy">20</span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value normal">10</span>
                </div>
                <div>
                  <span className="type">Difficult</span>
                  <span className="value difficult">45</span>
                </div>
              </div>
              <div className="highscore-type">Timer</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value easy">30</span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value normal">50</span>
                </div>
                <div>
                  <span className="type">Difficult</span>
                  <span className="value difficult">5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-card">
            <p className="sub-card-header">Multiplyer</p>
            <div className="sub-card-body">
              <div className="highscore-type">Timer</div>
              <div className="highscore-value">
                <div>
                  <span className="type">Easy</span>
                  <span className="value">30</span>
                </div>
                <div>
                  <span className="type">Normal</span>
                  <span className="value">50</span>
                </div>
                <div>
                  <span className="type">Difficult</span>
                  <span className="value">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
