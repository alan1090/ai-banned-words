import React, { useState, useEffect } from 'react';
import './App.css';
import './Game.css';
import StartScreen from './components/StartScreen';
import SettingsScreen from './components/SettingsScreen';
import PlayersScreen from './components/PlayersScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import { useGameState } from './hooks/useGameState';

const APP_VERSION = "1.2.0";
console.log(`[BannedWords] App Version: ${APP_VERSION}`);

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const gameState = useGameState();

  // Remove any async from render methods
  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onStart={() => setCurrentScreen('settings')} />;
      case 'settings':
        return (
          <SettingsScreen
            onContinue={() => setCurrentScreen('players')}
            gameState={gameState}
          />
        );
      case 'players':
        return (
          <PlayersScreen
            onStartGame={() => setCurrentScreen('game')}
            gameState={gameState}
          />
        );
      case 'game':
        return (
          <GameScreen
            onEndGame={() => setCurrentScreen('results')}
            gameState={gameState}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            onPlayAgain={() => {
              gameState.updateGameState({
                scores: new Array(gameState.gameState.players.length).fill(0),
                currentRound: 0,
                currentPlayerIndex: -1,
                wordsUsed: new Set(),
                gameActive: true
              });
              setCurrentScreen('game');
            }}
            onNewGame={() => setCurrentScreen('start')}
            gameState={gameState}
          />
        );
      default:
        return <StartScreen onStart={() => setCurrentScreen('settings')} />;
    }
  };

  return (
    <div className="container">
      <header className="game-header">
        <span className="title-icon">🎯</span>
        <h1 className="game-title">AI Banned Words Game</h1>
      </header>
      {renderScreen()}
    </div>
  );
}

export default App;