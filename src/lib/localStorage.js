const STORAGE_KEYS = {
  USER: "puzzlequest_user",
  PROGRESS: "puzzlequest_progress",
  SETTINGS: "puzzlequest_settings",
  DAILY_PUZZLES: "puzzlequest_daily_puzzles",
  STATS: "puzzlequest_stats",
};

// User Management
export const saveUser = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    return false;
  }
};

export const getUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const updateUser = (updates) => {
  try {
    const currentUser = getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      return saveUser(updatedUser);
    }
    return false;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_PUZZLES);
    return true;
  } catch (error) {
    console.error("Error removing user:", error);
    return false;
  }
};

// Progress Management
export const saveProgress = (progressData) => {
  try {
    const currentProgress = getProgress();
    const updatedProgress = { ...currentProgress, ...progressData };
    localStorage.setItem(
      STORAGE_KEYS.PROGRESS,
      JSON.stringify(updatedProgress),
    );
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

export const getProgress = () => {
  try {
    const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progressData ? JSON.parse(progressData) : getDefaultProgress();
  } catch (error) {
    console.error("Error getting progress:", error);
    return getDefaultProgress();
  }
};

const getDefaultProgress = () => ({
  level: 1,
  xp: 0,
  totalXP: 0,
  streak: 0, // Daily login/completion streak
  longestStreak: 0, // Longest daily streak
  sessionStreak: 0, // Current session consecutive correct answers
  bestSessionStreak: 0, // Best session streak ever
  puzzlesSolved: 0,
  averageIQ: 100,
  iqHistory: [],
  difficulty: "medium",
  achievements: [],
  lastPlayDate: null,
  dailyProgress: {
    date: null,
    completed: 0,
    puzzles: [],
  },
});

// Stats Management
export const saveStats = (statsData) => {
  try {
    const currentStats = getStats();
    const updatedStats = { ...currentStats, ...statsData };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    return true;
  } catch (error) {
    console.error("Error saving stats:", error);
    return false;
  }
};

export const getStats = () => {
  try {
    const statsData = localStorage.getItem(STORAGE_KEYS.STATS);
    return statsData ? JSON.parse(statsData) : getDefaultStats();
  } catch (error) {
    console.error("Error getting stats:", error);
    return getDefaultStats();
  }
};

const getDefaultStats = () => ({
  totalPuzzlesSolved: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  averageTime: 0,
  bestTime: null,
  byDifficulty: {
    easy: { solved: 0, correct: 0 },
    medium: { solved: 0, correct: 0 },
    hard: { solved: 0, correct: 0 },
    expert: { solved: 0, correct: 0 },
  },
  byType: {
    logic: { solved: 0, correct: 0 },
    math: { solved: 0, correct: 0 },
    word: { solved: 0, correct: 0 },
    pattern: { solved: 0, correct: 0 },
  },
  dailyStats: {}, // Track stats by date
  weeklyStats: [],
  monthlyStats: [],
  accuracyHistory: [], // Track accuracy over time
  streakHistory: [], // Track streak changes
});

// Daily Puzzles Management
export const saveDailyPuzzles = (puzzles) => {
  try {
    const today = new Date().toDateString();
    const dailyData = {
      date: today,
      puzzles: puzzles,
      completed: [],
      startTime: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_PUZZLES, JSON.stringify(dailyData));
    return true;
  } catch (error) {
    console.error("Error saving daily puzzles:", error);
    return false;
  }
};

export const getDailyPuzzles = () => {
  try {
    const dailyData = localStorage.getItem(STORAGE_KEYS.DAILY_PUZZLES);
    if (!dailyData) return null;

    const parsed = JSON.parse(dailyData);
    const today = new Date().toDateString();

    // Check if puzzles are from today
    if (parsed.date !== today) {
      return null; // Puzzles are old, need new ones
    }

    return parsed;
  } catch (error) {
    console.error("Error getting daily puzzles:", error);
    return null;
  }
};

export const markPuzzleCompleted = (puzzleId, answer, isCorrect, timeTaken) => {
  try {
    const dailyData = getDailyPuzzles();
    if (!dailyData) return false;

    const completedPuzzle = {
      puzzleId,
      answer,
      isCorrect,
      timeTaken,
      completedAt: new Date().toISOString(),
    };

    dailyData.completed.push(completedPuzzle);
    localStorage.setItem(STORAGE_KEYS.DAILY_PUZZLES, JSON.stringify(dailyData));

    return true;
  } catch (error) {
    console.error("Error marking puzzle completed:", error);
    return false;
  }
};

// Settings Management
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

export const getSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error("Error getting settings:", error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  theme: "dark",
  soundEnabled: true,
  notificationsEnabled: true,
  difficulty: "medium",
  autoAdvance: true,
  showHints: true,
  language: "en",
});

// Analytics and IQ Calculation
export const calculateIQ = (
  correctAnswers,
  totalAnswers,
  difficulty,
  timeTaken,
) => {
  try {
    if (totalAnswers === 0) return 100;

    const accuracy = correctAnswers / totalAnswers;
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3,
      expert: 1.6,
    };

    const timeBonus = Math.max(0, 1 - timeTaken / (totalAnswers * 60)); // Bonus for speed
    const baseIQ = 100;
    const iqAdjustment =
      (accuracy - 0.5) * 50 * difficultyMultiplier[difficulty] + timeBonus * 10;

    return Math.round(Math.max(70, Math.min(200, baseIQ + iqAdjustment)));
  } catch (error) {
    console.error("Error calculating IQ:", error);
    return 100;
  }
};

// Utility functions
export const isNewDay = () => {
  try {
    const progress = getProgress();
    const today = new Date().toDateString();
    return progress.lastPlayDate !== today;
  } catch (error) {
    console.error("Error checking new day:", error);
    return true;
  }
};

export const isNewSession = () => {
  try {
    const progress = getProgress();
    const now = new Date().getTime();
    const lastSession = progress.lastSessionTime || 0;
    // Consider it a new session if more than 30 minutes have passed
    return now - lastSession > 30 * 60 * 1000;
  } catch (error) {
    console.error("Error checking new session:", error);
    return true;
  }
};

export const startNewSession = () => {
  try {
    const progress = getProgress();
    const now = new Date().getTime();

    // Reset session streak if it's a new session
    if (isNewSession()) {
      progress.sessionStreak = 0;
    }

    progress.lastSessionTime = now;
    return saveProgress(progress);
  } catch (error) {
    console.error("Error starting new session:", error);
    return false;
  }
};

export const updateDailyStreak = () => {
  try {
    const progress = getProgress();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (progress.lastPlayDate === yesterday) {
      // Continue streak
      progress.streak += 1;
      progress.longestStreak = Math.max(
        progress.longestStreak,
        progress.streak,
      );
    } else if (progress.lastPlayDate !== today) {
      // Reset streak if not consecutive
      progress.streak = 1;
    }

    progress.lastPlayDate = today;
    return saveProgress(progress);
  } catch (error) {
    console.error("Error updating daily streak:", error);
    return false;
  }
};
