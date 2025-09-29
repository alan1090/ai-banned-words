import React, { useState } from "react";

const SettingsScreen = ({ onContinue, gameState }) => {
  const [settings, setSettings] = useState({
    numberOfPlayers: 3,
    numberOfRounds: 3,
    timePerRound: 60,
    skipsPerRound: 3,
    category: "general",
    difficulty: "medium",
    language: "english",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    gameState.updateGameState({
      totalRounds: settings.numberOfRounds,
      category: settings.category,
      difficulty: settings.difficulty,
      language: settings.language,
      totalTime: settings.timePerRound,
      timeLeft: settings.timePerRound,
      skipsPerRound:
        settings.skipsPerRound === 10 ? Infinity : settings.skipsPerRound,
      currentSkips:
        settings.skipsPerRound === 10 ? Infinity : settings.skipsPerRound,
    });

    onContinue();
  };

  const handleTimeOptionClick = (time) => {
    setSettings((prev) => ({ ...prev, timePerRound: time }));
  };

  const handleSkipOptionClick = (skips) => {
    setSettings((prev) => ({ ...prev, skipsPerRound: skips }));
  };

  return (
    <div id="settingsScreen" className="screen active">
      <div className="settings-card">
        <h2>
          <i className="fas fa-cog"></i> Game Setup
        </h2>
        <form
          id="settingsForm"
          className="settings-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numberOfPlayers">
                <i className="fas fa-users"></i> Players
              </label>
              <input
                type="number"
                id="numberOfPlayers"
                min="2"
                max="8"
                value={settings.numberOfPlayers}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    numberOfPlayers: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfRounds">
                <i className="fas fa-sync-alt"></i> Rounds
              </label>
              <input
                type="number"
                id="numberOfRounds"
                min="1"
                max="10"
                value={settings.numberOfRounds}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    numberOfRounds: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="timePerRound">
                <i className="fas fa-clock"></i> Time per Round (sec)
              </label>
              <input
                type="number"
                id="timePerRound"
                min="30"
                max="180"
                value={settings.timePerRound}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    timePerRound: parseInt(e.target.value),
                  }))
                }
              />
              <div className="time-options">
                {[30, 60, 90, 120].map((time) => (
                  <div
                    key={time}
                    className={`time-option ${
                      settings.timePerRound === time ? "active" : ""
                    }`}
                    onClick={() => handleTimeOptionClick(time)}
                  >
                    {time}s
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="skipsPerRound">
                <i className="fas fa-forward"></i> Skips per Round
              </label>
              <input
                type="number"
                id="skipsPerRound"
                min="0"
                max="10"
                value={settings.skipsPerRound}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    skipsPerRound: parseInt(e.target.value),
                  }))
                }
              />
              <div className="skip-options">
                {[0, 3, 5, 10].map((skips) => (
                  <div
                    key={skips}
                    className={`skip-option ${
                      settings.skipsPerRound === skips ? "active" : ""
                    }`}
                    onClick={() => handleSkipOptionClick(skips)}
                  >
                    {skips === 10 ? "Unlimited" : skips}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                <i className="fas fa-folder"></i> Category
              </label>
              <select
                id="category"
                value={settings.category}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="general">🎲 General</option>
                <option value="animals">🐾 Animals</option>
                <option value="cinema">🎬 Cinema</option>
                <option value="sports">⚽ Sports</option>
                <option value="food">🍕 Food & Drink</option>
                <option value="geography">🌍 Geography</option>
                <option value="history">📚 History</option>
                <option value="science">🔬 Science</option>
                <option value="technology">💻 Technology</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">
                <i className="fas fa-bolt"></i> Difficulty
              </label>
              <select
                id="difficulty"
                value={settings.difficulty}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
              >
                <option value="easy">😊 Easy</option>
                <option value="medium">😐 Medium</option>
                <option value="hard">😤 Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="language">
                <i className="fas fa-globe"></i> Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, language: e.target.value }))
                }
              >
                <option value="english">🇺🇸 English</option>
                <option value="spanish">🇪🇸 Español</option>
                <option value="french">🇫🇷 Français</option>
                <option value="german">🇩🇪 Deutsch</option>
                <option value="italian">🇮🇹 Italiano</option>
                <option value="portuguese">🇵🇹 Português</option>
                <option value="dutch">🇳🇱 Nederlands</option>
                <option value="russian">🇷🇺 Русский</option>
                <option value="chinese">🇨🇳 中文</option>
                <option value="japanese">🇯🇵 日本語</option>
                <option value="korean">🇰🇷 한국어</option>
                <option value="arabic">🇸🇦 العربية</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            <i className="fas fa-arrow-right btn-icon"></i>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsScreen;
