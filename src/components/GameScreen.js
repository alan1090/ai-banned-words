import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import PauseModal from "./PauseModal";

const GameScreen = ({ onEndGame, gameState }) => {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [wordDisplayOpacity, setWordDisplayOpacity] = useState(1);
  const [tabooWordsOpacity, setTabooWordsOpacity] = useState(1);

  useEffect(() => {
    if (gameState.gameState.gameActive && !gameState.gameState.roundEnded) {
      startNewTurn();
    }
  }, [gameState.gameState.currentPlayerIndex]);

  const startNewTurn = () => {
    gameState.resetTimer();
    gameState.updateGameState({
      currentSkips: gameState.gameState.skipsPerRound,
      isGeneratingWord: false,
      roundEnded: false,
    });
    generateNewWord();
    gameState.startTimer(handleTimerEnd);
  };

  const generateNewWord = async () => {
    gameState.pauseTimer();
    gameState.updateGameState({ isGeneratingWord: true });

    try {
      fadeOutCurrentWord();
      await new Promise((resolve) => setTimeout(resolve, 300));

      const wordData = await gameState.fetchWordFromAI();

      const newWordsUsed = new Set(gameState.gameState.wordsUsed);
      newWordsUsed.add(wordData.guess);

      gameState.updateGameState({
        currentWord: wordData.guess,
        tabooWords: wordData.taboo,
        wordsUsed: newWordsUsed,
        isGeneratingWord: false,
      });

      displayWord();
    } catch (error) {
      console.error("Failed to generate word:", error);
      showError(`Failed to generate word: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return generateNewWord();
    } finally {
      if (!gameState.gameState.roundEnded) {
        gameState.startTimer(handleTimerEnd);
      }
    }
  };

  const fadeOutCurrentWord = () => {
    if (gameState.gameState.currentWord) {
      setWordDisplayOpacity(0);
      setTabooWordsOpacity(0);
    }
  };

  const displayWord = () => {
    setWordDisplayOpacity(1);
    setTabooWordsOpacity(1);
  };

  const handleCorrectGuess = () => {
    if (gameState.gameState.isGeneratingWord) return;

    const newScores = [...gameState.gameState.scores];
    newScores[gameState.gameState.currentPlayerIndex]++;

    gameState.updateGameState({ scores: newScores });
    showFeedback("✅ Correct!", "success");
    generateNewWord();
  };

  const handlePassWord = () => {
    if (gameState.gameState.isGeneratingWord) return;

    if (
      gameState.gameState.currentSkips <= 0 &&
      gameState.gameState.skipsPerRound !== Infinity
    ) {
      showFeedback("⚠️ No skips left!", "warning");
      return;
    }

    if (gameState.gameState.skipsPerRound !== Infinity) {
      gameState.updateGameState({
        currentSkips: gameState.gameState.currentSkips - 1,
      });
    }

    showFeedback("⏭️ Passed", "warning");
    generateNewWord();
  };

  const handleTimerEnd = () => {
    endTurn();
  };

  const endTurn = () => {
    gameState.pauseTimer();

    const newPlayerIndex =
      (gameState.gameState.currentPlayerIndex + 1) %
      gameState.gameState.players.length;
    const newTurn = gameState.gameState.currentTurn + 1;

    if (newTurn >= gameState.gameState.players.length) {
      endRound();
    } else {
      gameState.updateGameState({
        currentPlayerIndex: newPlayerIndex,
        currentTurn: newTurn,
      });
    }
  };

  const endRound = () => {
    gameState.pauseTimer();
    gameState.updateGameState({ roundEnded: true });
    showFeedback("⏰ Round complete!", "warning");
  };

  const startNextRound = () => {
    const newRound = gameState.gameState.currentRound + 1;

    if (newRound > gameState.gameState.totalRounds) {
      onEndGame();
      return;
    }

    gameState.updateGameState({
      currentRound: newRound,
      currentPlayerIndex: 0,
      currentTurn: 0,
      roundEnded: false,
    });
  };

  const togglePause = () => {
    const newPausedState = !gameState.gameState.isPaused;
    gameState.updateGameState({ isPaused: newPausedState });

    if (newPausedState) {
      gameState.pauseTimer();
      setShowPauseModal(true);
    } else {
      setShowPauseModal(false);
      if (!gameState.gameState.roundEnded) {
        gameState.startTimer(handleTimerEnd);
      }
    }
  };

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 1000);
  };

  const showError = (message) => {
    setFeedback({ message, type: "error" });
    setTimeout(() => setFeedback(null), 3000);
  };

  const { gameState: state } = gameState;

  if (!state.gameActive && currentScreen === "game") {
    return <div>Loading game...</div>;
  }

  return (
    <div id="gameScreen" className="screen active">
      <div className="game-status">
        <div className="round-info">
          <span id="roundDisplay">
            Round {state.currentRound} of {state.totalRounds}
          </span>
        </div>
        <div className="turn-indicator" id="turnIndicator">
          <i className="fas fa-crown"></i>
          <span id="currentPlayerName">
            {state.players[state.currentPlayerIndex]}
          </span>
          's Turn
        </div>
      </div>

      <div className="players-grid" id="playersGrid">
        {state.players.map((player, index) => (
          <div
            key={index}
            className={`player-card ${
              index === state.currentPlayerIndex ? "active" : ""
            }`}
          >
            <div className="player-name">{player}</div>
            <div className="player-score">{state.scores[index]}</div>
          </div>
        ))}
      </div>

      <div className="word-card">
        <div
          className="word-display"
          id="wordDisplay"
          style={{
            opacity: wordDisplayOpacity,
            transition: "opacity 0.3s ease",
          }}
        >
          {state.isGeneratingWord ? (
            <>
              <div className="loading-spinner"></div>
              <span>Generating word...</span>
            </>
          ) : (
            state.currentWord || "Get ready..."
          )}
        </div>

        <div className="taboo-container">
          <h4>
            <i className="fas fa-ban"></i> Banned Words
          </h4>
          <div
            className="taboo-words"
            id="tabooWords"
            style={{
              opacity: tabooWordsOpacity,
              transition: "opacity 0.3s ease",
            }}
          >
            {state.isGeneratingWord ? (
              <div className="loading-spinner"></div>
            ) : (
              state.tabooWords &&
              state.tabooWords.map((word, index) => (
                <div
                  key={index}
                  className="taboo-word"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {word}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Timer gameState={state} />

      <div className="game-controls">
        <button
          id="correctButton"
          className="btn btn-success"
          onClick={handleCorrectGuess}
          disabled={state.isGeneratingWord}
        >
          <i className="fas fa-check btn-icon"></i>
          Correct
        </button>
        <button
          id="passButton"
          className="btn btn-warning"
          onClick={handlePassWord}
          disabled={
            state.isGeneratingWord ||
            (state.currentSkips <= 0 && state.skipsPerRound !== Infinity)
          }
        >
          <i className="fas fa-forward btn-icon"></i>
          Pass ({state.currentSkips === Infinity
            ? "∞"
            : state.currentSkips}{" "}
          left)
        </button>
        <button
          id="pauseButton"
          className="btn btn-secondary"
          onClick={togglePause}
        >
          <i
            className={`fas ${
              state.isPaused ? "fa-play" : "fa-pause"
            } btn-icon`}
          ></i>
          {state.isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      {state.roundEnded && (
        <div className="round-controls" id="roundControls">
          <button
            id="nextRoundButton"
            className="btn btn-primary btn-large"
            onClick={startNextRound}
          >
            <i className="fas fa-arrow-right btn-icon"></i>
            Next Round
          </button>
          <button
            id="endGameButton"
            className="btn btn-danger"
            onClick={onEndGame}
          >
            <i className="fas fa-flag-checkered btn-icon"></i>
            End Game
          </button>
        </div>
      )}

      {showPauseModal && (
        <PauseModal
          onResume={togglePause}
          onQuit={() => {
            setShowPauseModal(false);
            onEndGame();
          }}
        />
      )}

      {feedback && (
        <div
          className={`feedback feedback-${feedback.type}`}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              feedback.type === "success"
                ? "#00b09b"
                : feedback.type === "warning"
                ? "#ff9a00"
                : "#ff4757",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "50px",
            fontWeight: 600,
            zIndex: 1000,
            animation: "feedbackPop 1s ease-out forwards",
          }}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default GameScreen;
