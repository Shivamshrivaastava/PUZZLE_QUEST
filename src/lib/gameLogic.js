import {
  getProgress,
  saveProgress,
  getStats,
  saveStats,
  calculateIQ,
  updateDailyStreak,
} from "./localStorage.js";

export const processAnswer = (puzzle, selectedAnswer, timeTaken) => {
  const isCorrect = selectedAnswer === puzzle.correctAnswer;
  const points = isCorrect ? puzzle.points : 0;

  // Update progress
  const progress = getProgress();
  const stats = getStats();

  // Store previous values for comparison
  const previousAccuracy =
    stats.totalPuzzlesSolved > 0
      ? (stats.correctAnswers / stats.totalPuzzlesSolved) * 100
      : 0;
  const previousStreak = progress.streak;

  if (isCorrect) {
    progress.xp += points;
    progress.totalXP += points;
    progress.puzzlesSolved += 1;
    stats.correctAnswers += 1;
  } else {
    stats.incorrectAnswers += 1;
  }

  // Update stats
  stats.totalPuzzlesSolved += 1;

  // Ensure difficulty exists in stats
  if (!stats.byDifficulty[puzzle.difficulty]) {
    stats.byDifficulty[puzzle.difficulty] = { solved: 0, correct: 0 };
  }

  stats.byDifficulty[puzzle.difficulty].solved += 1;
  if (isCorrect) {
    stats.byDifficulty[puzzle.difficulty].correct += 1;
  }

  // Ensure type exists in stats
  if (!stats.byType[puzzle.type]) {
    stats.byType[puzzle.type] = { solved: 0, correct: 0 };
  }

  stats.byType[puzzle.type].solved += 1;
  if (isCorrect) {
    stats.byType[puzzle.type].correct += 1;
  }

  // Update timing stats
  if (stats.averageTime === 0) {
    stats.averageTime = timeTaken;
  } else {
    stats.averageTime = (stats.averageTime + timeTaken) / 2;
  }

  if (!stats.bestTime || timeTaken < stats.bestTime) {
    stats.bestTime = timeTaken;
  }

  // Calculate new accuracy
  const newAccuracy = (stats.correctAnswers / stats.totalPuzzlesSolved) * 100;

  // Calculate new IQ
  const newIQ = calculateIQ(
    stats.correctAnswers,
    stats.totalPuzzlesSolved,
    puzzle.difficulty,
    timeTaken,
  );

  progress.iqHistory.push({
    date: new Date().toISOString(),
    iq: newIQ,
    puzzle: puzzle.type,
    difficulty: puzzle.difficulty,
    isCorrect,
    timeTaken,
  });

  progress.averageIQ = newIQ;

  // Update session streak (consecutive correct answers in current session)
  if (isCorrect) {
    if (!progress.sessionStreak) progress.sessionStreak = 0;
    progress.sessionStreak += 1;
    progress.bestSessionStreak = Math.max(
      progress.bestSessionStreak || 0,
      progress.sessionStreak,
    );
  } else {
    progress.sessionStreak = 0;
  }

  // Check for level up
  const newLevel = calculateLevel(progress.totalXP);
  const leveledUp = newLevel > progress.level;
  if (leveledUp) {
    progress.level = newLevel;
  }

  // Add daily tracking
  const today = new Date().toDateString();
  if (!stats.dailyStats) stats.dailyStats = {};
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = {
      solved: 0,
      correct: 0,
      byDifficulty: {},
      byType: {},
    };
  }

  stats.dailyStats[today].solved += 1;
  if (isCorrect) {
    stats.dailyStats[today].correct += 1;
  }

  // Track daily stats by difficulty and type
  if (!stats.dailyStats[today].byDifficulty[puzzle.difficulty]) {
    stats.dailyStats[today].byDifficulty[puzzle.difficulty] = {
      solved: 0,
      correct: 0,
    };
  }
  if (!stats.dailyStats[today].byType[puzzle.type]) {
    stats.dailyStats[today].byType[puzzle.type] = { solved: 0, correct: 0 };
  }

  stats.dailyStats[today].byDifficulty[puzzle.difficulty].solved += 1;
  stats.dailyStats[today].byType[puzzle.type].solved += 1;

  if (isCorrect) {
    stats.dailyStats[today].byDifficulty[puzzle.difficulty].correct += 1;
    stats.dailyStats[today].byType[puzzle.type].correct += 1;
  }

  // Save updates
  saveProgress(progress);
  saveStats(stats);

  // Dispatch custom event to notify components of stats update
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("statsUpdated"));
  }

  console.log("Updated stats:", {
    totalSolved: stats.totalPuzzlesSolved,
    accuracy: newAccuracy.toFixed(1) + "%",
    currentSessionStreak: progress.sessionStreak,
    bestSessionStreak: progress.bestSessionStreak,
    dailyStreak: progress.streak,
    longestDailyStreak: progress.longestStreak,
    byDifficulty: stats.byDifficulty,
    byType: stats.byType,
  });

  return {
    isCorrect,
    points,
    newXP: progress.xp,
    newLevel: progress.level,
    leveledUp,
    newIQ,
    explanation: puzzle.explanation,
    stats: {
      totalSolved: stats.totalPuzzlesSolved,
      accuracy: newAccuracy,
      previousAccuracy,
      currentSessionStreak: progress.sessionStreak,
      bestSessionStreak: progress.bestSessionStreak,
      dailyStreak: progress.streak,
      longestDailyStreak: progress.longestStreak,
      difficultyBreakdown: stats.byDifficulty,
      typeBreakdown: stats.byType,
    },
  };
};

export const calculateLevel = (totalXP) => {
  // Level progression: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, etc.
  if (totalXP < 100) return 1;
  if (totalXP < 250) return 2;
  if (totalXP < 450) return 3;
  if (totalXP < 700) return 4;
  if (totalXP < 1000) return 5;

  // For higher levels, increase requirement by 350 XP each level
  return Math.floor((totalXP - 1000) / 350) + 6;
};

export const getXPForNextLevel = (currentLevel) => {
  const requirements = [0, 100, 250, 450, 700, 1000];

  if (currentLevel < 5) {
    return requirements[currentLevel];
  }

  // For levels 6+, requirement increases by 350 each level
  return 1000 + (currentLevel - 5) * 350;
};

export const completeDailyChallenge = () => {
  updateDailyStreak();
  const progress = getProgress();

  // Award bonus XP for completing all daily puzzles
  const bonusXP = 50 + progress.streak * 10;
  progress.xp += bonusXP;
  progress.totalXP += bonusXP;

  // Check for achievements
  const newAchievements = checkAchievements(progress, getStats());
  progress.achievements.push(...newAchievements);

  saveProgress(progress);

  return {
    bonusXP,
    newAchievements,
    streak: progress.streak,
  };
};

export const checkAchievements = (progress, stats) => {
  const achievements = [];
  const existingAchievements = progress.achievements.map((a) => a.id);

  // Streak achievements
  if (progress.streak >= 7 && !existingAchievements.includes("week_streak")) {
    achievements.push({
      id: "week_streak",
      title: "Week Warrior",
      description: "Complete puzzles for 7 days in a row",
      icon: "🔥",
      date: new Date().toISOString(),
    });
  }

  if (progress.streak >= 30 && !existingAchievements.includes("month_streak")) {
    achievements.push({
      id: "month_streak",
      title: "Monthly Master",
      description: "Complete puzzles for 30 days in a row",
      icon: "👑",
      date: new Date().toISOString(),
    });
  }

  // Puzzle count achievements
  if (
    progress.puzzlesSolved >= 50 &&
    !existingAchievements.includes("puzzle_50")
  ) {
    achievements.push({
      id: "puzzle_50",
      title: "Puzzle Novice",
      description: "Solve 50 puzzles",
      icon: "🧩",
      date: new Date().toISOString(),
    });
  }

  if (
    progress.puzzlesSolved >= 100 &&
    !existingAchievements.includes("puzzle_100")
  ) {
    achievements.push({
      id: "puzzle_100",
      title: "Puzzle Expert",
      description: "Solve 100 puzzles",
      icon: "🎯",
      date: new Date().toISOString(),
    });
  }

  // IQ achievements
  if (progress.averageIQ >= 130 && !existingAchievements.includes("high_iq")) {
    achievements.push({
      id: "high_iq",
      title: "Brain Genius",
      description: "Achieve an IQ score of 130+",
      icon: "🧠",
      date: new Date().toISOString(),
    });
  }

  // Level achievements
  if (progress.level >= 5 && !existingAchievements.includes("level_5")) {
    achievements.push({
      id: "level_5",
      title: "Rising Star",
      description: "Reach level 5",
      icon: "⭐",
      date: new Date().toISOString(),
    });
  }

  if (progress.level >= 10 && !existingAchievements.includes("level_10")) {
    achievements.push({
      id: "level_10",
      title: "Puzzle Legend",
      description: "Reach level 10",
      icon: "🏆",
      date: new Date().toISOString(),
    });
  }

  // Accuracy achievements
  const accuracy =
    stats.totalPuzzlesSolved > 0
      ? stats.correctAnswers / stats.totalPuzzlesSolved
      : 0;
  if (
    accuracy >= 0.9 &&
    stats.totalPuzzlesSolved >= 20 &&
    !existingAchievements.includes("accuracy_90")
  ) {
    achievements.push({
      id: "accuracy_90",
      title: "Precision Master",
      description: "Maintain 90% accuracy over 20+ puzzles",
      icon: "🎯",
      date: new Date().toISOString(),
    });
  }

  return achievements;
};

export const getDifficultyProgression = (progress, stats) => {
  const currentDifficulty = progress.difficulty;
  const accuracy =
    stats.totalPuzzlesSolved > 0
      ? stats.correctAnswers / stats.totalPuzzlesSolved
      : 0;

  // Auto-adjust difficulty based on performance
  if (accuracy >= 0.8 && stats.totalPuzzlesSolved >= 10) {
    const difficultyLevels = ["easy", "medium", "hard", "expert"];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);

    if (currentIndex < difficultyLevels.length - 1) {
      return difficultyLevels[currentIndex + 1];
    }
  } else if (accuracy < 0.5 && stats.totalPuzzlesSolved >= 5) {
    const difficultyLevels = ["easy", "medium", "hard", "expert"];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);

    if (currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }
  }

  return currentDifficulty;
};

export const getWeeklyReport = () => {
  const progress = getProgress();
  const stats = getStats();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyIQData = progress.iqHistory.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekAgo && entryDate <= today;
  });

  const weeklyAvgIQ =
    weeklyIQData.length > 0
      ? weeklyIQData.reduce((sum, entry) => sum + entry.iq, 0) /
        weeklyIQData.length
      : progress.averageIQ;

  return {
    puzzlesSolved: weeklyIQData.length,
    averageIQ: Math.round(weeklyAvgIQ),
    streak: progress.streak,
    level: progress.level,
    xpGained: weeklyIQData.length * 25, // Approximate
    improvements: generateImprovements(weeklyIQData, stats),
  };
};

const generateImprovements = (weeklyData, stats) => {
  const improvements = [];

  if (weeklyData.length >= 7) {
    improvements.push("🎯 Consistent daily practice - keep it up!");
  }

  const avgIQ =
    weeklyData.reduce((sum, d) => sum + d.iq, 0) / weeklyData.length;
  if (avgIQ > 120) {
    improvements.push("🧠 Excellent cognitive performance this week!");
  }

  const accuracy = stats.correctAnswers / stats.totalPuzzlesSolved;
  if (accuracy > 0.8) {
    improvements.push(
      "✨ Great accuracy - you're really getting the hang of this!",
    );
  } else if (accuracy < 0.6) {
    improvements.push("💡 Try reviewing explanations to improve accuracy");
  }

  return improvements;
};
