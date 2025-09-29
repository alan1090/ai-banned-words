import React from 'react';

const Timer = ({ gameState }) => {
  const progress = (gameState.timeLeft / gameState.totalTime) * 283;
  const strokeColor = gameState.timeLeft <= 10 ? '#ff4757' : 
                     gameState.timeLeft <= 30 ? '#ffa502' : '#667eea';

  return (
    <div className="timer-container">
      <div className="timer-circle">
        <svg className="timer-svg" viewBox="0 0 100 100">
          <circle className="timer-bg" cx="50" cy="50" r="45"></circle>
          <circle
            className="timer-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              stroke: strokeColor,
              strokeDashoffset: 283 - progress
            }}
          ></circle>
        </svg>
        <div className="timer-text">
          <span>{gameState.timeLeft}</span>
          <small>sec</small>
        </div>
      </div>
    </div>
  );
};

export default Timer;