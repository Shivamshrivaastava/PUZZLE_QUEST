import { useState, useEffect } from "react";
import { getProgress, getStats } from "../lib/localStorage";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { TrendingUp, Target, Zap, Trophy } from "lucide-react";

const LiveStatsDisplay = () => {
  const [stats, setStats] = useState(getStats());
  const [progress, setProgress] = useState(getProgress());

  // Update stats when localStorage changes
  useEffect(() => {
    const updateStats = () => {
      setStats(getStats());
      setProgress(getProgress());
    };

    // Listen for localStorage changes
    window.addEventListener("storage", updateStats);

    // Custom event for local updates
    window.addEventListener("statsUpdated", updateStats);

    // Poll for updates every second (in case storage events don't fire)
    const interval = setInterval(updateStats, 1000);

    return () => {
      window.removeEventListener("storage", updateStats);
      window.removeEventListener("statsUpdated", updateStats);
      clearInterval(interval);
    };
  }, []);

  const accuracy =
    stats.totalPuzzlesSolved > 0
      ? (stats.correctAnswers / stats.totalPuzzlesSolved) * 100
      : 0;

  // Get today's stats
  const today = new Date().toDateString();
  const todayStats = stats.dailyStats?.[today] || { solved: 0, correct: 0 };

  return (
    <Card className="glass-effect border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Target className="text-purple-400" />
          <span>Live Stats</span>
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Solved */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xl font-bold text-blue-400">
                {stats.totalPuzzlesSolved}
              </span>
            </div>
            <p className="text-sm text-purple-200">Total Solved</p>
          </div>

          {/* Accuracy */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xl font-bold text-green-400">
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-purple-200">Accuracy</p>
          </div>

          {/* Session Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">
                {progress.sessionStreak || 0}
              </span>
            </div>
            <p className="text-sm text-purple-200">Session Streak</p>
          </div>

          {/* Daily Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="h-4 w-4 text-orange-400" />
              <span className="text-xl font-bold text-orange-400">
                {progress.streak}
              </span>
            </div>
            <p className="text-sm text-purple-200">Daily Streak</p>
          </div>
        </div>

        {/* Today's Performance */}
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">
                {todayStats.solved}
              </div>
              <p className="text-xs text-purple-200">Today Solved</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">
                {todayStats.solved > 0
                  ? ((todayStats.correct / todayStats.solved) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-purple-200">Today Accuracy</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStatsDisplay;
