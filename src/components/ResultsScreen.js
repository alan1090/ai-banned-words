import React from 'react';

const ResultsScreen = ({ onPlayAgain, onNewGame, gameState }) => {
  const results = gameState.gameState.players
    .map((player, index) => ({
      name: player,
      score: gameState.gameState.scores[index],
    }))
    .sort((a, b) => b.score - a.score);

  const medals = ['🥇', '🥈', '🥉'];
  const places = ['first', 'second', 'third'];

  return (
    <div id="resultsScreen" className="screen active">
      <div className="results-card">
        <h2><i className="fas fa-trophy"></i> Game Results</h2>
        <div className="podium" id="podium">
          {results.slice(0, 3).map((player, index) => (
            <div key={index} className={`podium-place ${places[index]}`}>
              <div className="podium-medal">{medals[index]}</div>
              <div className={`podium-step ${places[index]}`}>
                <div className="podium-name">{player.name}</div>
                <div className="podium-score">{player.score}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="final-scores" id="finalScores">
          <h4>Final Scores</h4>
          {results.map((player, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              margin: '0.5rem 0', 
              padding: '0.5rem', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px' 
            }}>
              <span>{index + 1}. {player.name}</span>
              <span style={{ fontWeight: 'bold' }}>{player.score} points</span>
            </div>
          ))}
        </div>
        <div className="results-actions">
          <button id="playAgainButton" className="btn btn-primary btn-large" onClick={onPlayAgain}>
            <i className="fas fa-redo btn-icon"></i>
            Play Again
          </button>
          <button id="newGameButton" className="btn btn-secondary" onClick={onNewGame}>
            <i className="fas fa-plus-circle btn-icon"></i>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;