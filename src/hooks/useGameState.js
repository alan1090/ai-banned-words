import { useState, useRef, useCallback } from "react";
import callDeepSeek from "../services/deepseekApi";

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    players: [],
    scores: [],
    currentRound: 0,
    totalRounds: 3,
    currentPlayerIndex: 0,
    currentWord: null,
    tabooWords: [],
    timeLeft: 60,
    totalTime: 60,
    wordsUsed: new Set(),
    isGeneratingWord: false,
    isPaused: false,
    category: "general",
    difficulty: "medium",
    language: "english",
    gameActive: false,
    currentTurn: 0,
    roundEnded: false,
    skipsPerRound: 3,
    currentSkips: 3,
  });

  const timerRef = useRef(null);

  const updateGameState = useCallback((updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (onTimerEnd) => {
      pauseTimer();

      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.isPaused || prev.isGeneratingWord || prev.roundEnded) {
            return prev;
          }

          const newTimeLeft = prev.timeLeft - 1;

          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current);
            onTimerEnd();
            return { ...prev, timeLeft: 0 };
          }

          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    },
    [pauseTimer]
  );

  const resetTimer = useCallback(
    (newTime) => {
      pauseTimer();
      updateGameState({
        timeLeft: newTime || gameState.totalTime,
        totalTime: newTime || gameState.totalTime,
      });
    },
    [pauseTimer, updateGameState, gameState.totalTime]
  );

  // DeepSeek API integration
  const fetchWordFromAI = useCallback(async () => {
    const languageMap = {
      english: "English",
      spanish: "Spanish (Español)",
      french: "French (Français)",
      german: "German (Deutsch)",
      italian: "Italian (Italiano)",
      portuguese: "Portuguese (Português)",
      dutch: "Dutch (Nederlands)",
      russian: "Russian (Русский)",
      chinese: "Chinese (中文)",
      japanese: "Japanese (日本語)",
      korean: "Korean (한국어)",
      arabic: "Arabic (العربية)",
    };

    const categoryMap = {
      general: "any topic or subject",
      animals: "animals, wildlife, pets, or creatures",
      cinema: "movies, films, actors, directors, or entertainment",
      sports: "sports, athletics, games, or physical activities",
      food: "food, drinks, cooking, restaurants, or cuisine",
      geography: "countries, cities, landmarks, or geographical features",
      history: "historical events, figures, periods, or civilizations",
      science: "scientific concepts, discoveries, technology, or research",
      technology: "computers, software, gadgets, or digital technology",
    };

    const difficultyMap = {
      easy: "simple, common words that most people know",
      medium: "moderately challenging words that require some thinking",
      hard: "difficult, complex, or specialized terms that are challenging to describe",
    };

    const languagePrompt = languageMap[gameState.language] || "English";
    const categoryPrompt = categoryMap[gameState.category] || "any topic";
    const difficultyPrompt =
      difficultyMap[gameState.difficulty] || "medium difficulty";
    const usedWords = Array.from(gameState.wordsUsed);

    const seed = Math.random().toString(36).substring(2, 8);

    const prompt = `Generate a word for a Taboo-style guessing game in ${languagePrompt}.

Language: ${languagePrompt}
Category: ${categoryPrompt}
Difficulty: ${difficultyPrompt}
Seed: ${seed}
${
  usedWords.length > 0
    ? `Already used words (avoid these): ${usedWords.join(", ")}`
    : ""
}

Create a JSON object with:
- "guess": A single word to guess (uppercase, in ${languagePrompt})
- "taboo": Array of exactly 5 banned words that players cannot use when describing the guess word (in ${languagePrompt})

Rules:
- The guess word should be related to the category
- Taboo words should be the most obvious words someone would use to describe the guess word
- Avoid using parts of the guess word in the taboo list
- Make it appropriately challenging for the difficulty level
- All words must be in ${languagePrompt}
- Return ONLY valid JSON, no explanations

Example format for English:
{
"guess": "ELEPHANT",
"taboo": ["animal", "trunk", "big", "gray", "africa"]
}`;

    try {
      const aiResponse = await callDeepSeek(prompt);
      const content = aiResponse.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from AI");
      }

      const result = parseAIResponse(content);

      if (result && result.guess && result.taboo && result.taboo.length === 5) {
        return result;
      }

      throw new Error("Invalid response format - missing guess or taboo words");
    } catch (error) {
      throw error;
    }
  }, [
    gameState.language,
    gameState.category,
    gameState.difficulty,
    gameState.wordsUsed,
  ]);

  const parseAIResponse = (content) => {
    try {
      let contentString;
      if (typeof content === "string") {
        contentString = content
          .replace(/```json\s*/i, "")
          .replace(/```\s*$/i, "")
          .replace(/```/g, "")
          .replace(/_/g, " ")
          .trim();
      } else if (typeof content === "object") {
        return cleanTabooData(content);
      } else {
        throw new Error("Invalid content type");
      }

      const parsed = JSON.parse(contentString);
      return cleanTabooData(parsed);
    } catch (error) {
      throw new Error("Invalid AI response format");
    }
  };

  const cleanTabooData = (data) => {
    if (!data.guess || typeof data.guess !== "string") {
      throw new Error("Invalid guess word");
    }

    if (!Array.isArray(data.taboo) || data.taboo.length !== 5) {
      throw new Error("Invalid taboo words array");
    }

    data.guess = data.guess.toUpperCase().trim();

    data.taboo = data.taboo
      .map((word) =>
        typeof word === "string" ? word.toLowerCase().trim() : ""
      )
      .filter((word) => word.length > 0);

    if (data.taboo.length !== 5) {
      throw new Error("Not enough valid taboo words");
    }

    return data;
  };

  return {
    gameState,
    updateGameState,
    pauseTimer,
    startTimer,
    resetTimer,
    fetchWordFromAI,
    timerRef,
  };
};