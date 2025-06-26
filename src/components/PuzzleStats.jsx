import { useState, useEffect } from "react";
import { getProgress, getStats } from "../lib/localStorage";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress, Badge } from "./BaseComponents";
import DifficultyTypeBreakdown from "./DifficultyTypeBreakdown";
import {
  TrendingUp,
  Target,
  Clock,
  Trophy,
  Brain,
  Zap,
  BarChart3,
  Calendar,
} from "lucide-react";

const PuzzleStats = () => {
  const [progress, setProgress] = useState(getProgress());
  const [stats, setStats] = useState(getStats());

  // Update stats when localStorage changes
  useEffect(() => {
    const updateStats = () => {
      setProgress(getProgress());
      setStats(getStats());
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

  // Calculate accuracy
  const overallAccuracy =
    stats.totalPuzzlesSolved > 0
      ? (stats.correctAnswers / stats.totalPuzzlesSolved) * 100
      : 0;

  // Get today's stats
  const today = new Date().toDateString();
  const todayStats = stats.dailyStats?.[today] || { solved: 0, correct: 0 };
  const todayAccuracy =
    todayStats.solved > 0 ? (todayStats.correct / todayStats.solved) * 100 : 0;

  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-purple-400" />
              <span>Overall Statistics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {stats.totalPuzzlesSolved}
              </div>
              <p className="text-sm text-purple-200">Total Solved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {overallAccuracy.toFixed(1)}%
              </div>
              <p className="text-sm text-purple-200">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {progress.streak}
              </div>
              <p className="text-sm text-purple-200">Daily Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {progress.longestStreak}
              </div>
              <p className="text-sm text-purple-200">Best Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="text-yellow-400" />
            <span>Session Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {progress.sessionStreak || 0}
              </div>
              <p className="text-sm text-purple-200">Current Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {progress.bestSessionStreak || 0}
              </div>
              <p className="text-sm text-purple-200">Best Session</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {todayStats.solved}
              </div>
              <p className="text-sm text-purple-200">Today Solved</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {todayAccuracy.toFixed(1)}%
              </div>
              <p className="text-sm text-purple-200">Today Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Stats */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="text-blue-400" />
            <span>Timing Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatTime(stats.averageTime)}
              </div>
              <p className="text-sm text-purple-200">Average Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatTime(stats.bestTime)}
              </div>
              <p className="text-sm text-purple-200">Best Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Difficulty and Type Breakdown */}
      <DifficultyTypeBreakdown />
    </div>
  );
};

export default PuzzleStats;
