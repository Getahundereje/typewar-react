import { useEffect, useState } from "react";

import "./success-message.styles.css";

// eslint-disable-next-line react/prop-types
const SuccessMessage = ({ message, onClose, duration = 2000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <div className="success-message-container">
      <div className="success-message">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <p>{message}</p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
