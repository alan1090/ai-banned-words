import React from 'react';

const PauseModal = ({ onResume, onQuit }) => {
  return (
    <div id="pauseModal" className="modal">
      <div className="modal-content">
        <h3><i className="fas fa-pause"></i> Game Paused</h3>
        <p>Take a break! Resume when you're ready.</p>
        <div className="modal-actions">
          <button id="resumeButton" className="btn btn-primary" onClick={onResume}>
            <i className="fas fa-play btn-icon"></i>
            Resume
          </button>
          <button id="quitButton" className="btn btn-danger" onClick={onQuit}>
            <i className="fas fa-door-open btn-icon"></i>
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;