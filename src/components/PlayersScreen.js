import React, { useState } from 'react';

const PlayersScreen = ({ onStartGame, gameState }) => {
  const [playerNames, setPlayerNames] = useState(
    Array.from({ length: 3 }, (_, i) => `Player ${i + 1}`)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const players = playerNames.map(name => name.trim() || 'Anonymous');
    const scores = new Array(players.length).fill(0);
    
    gameState.updateGameState({
      players,
      scores,
      gameActive: true,
      currentRound: 0,
      currentPlayerIndex: -1,
      currentTurn: 0,
      wordsUsed: new Set()
    });

    onStartGame();
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div id="playersScreen" className="screen active">
      <div className="players-card">
        <h2><i className="fas fa-user-edit"></i> Enter Player Names</h2>
        <form id="playersForm" className="players-form" onSubmit={handleSubmit}>
          {playerNames.map((name, index) => (
            <div key={index} className="form-group">
              <label>👤 Player {index + 1}</label>
              <input
                type="text"
                required
                placeholder={`Enter name for Player ${index + 1}`}
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-large">
            <i className="fas fa-gamepad btn-icon"></i>
            Start Playing!
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayersScreen;