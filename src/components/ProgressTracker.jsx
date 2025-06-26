import { useState, useEffect } from "react";
import { getProgress, getStats } from "../lib/localStorage";
import { getWeeklyReport } from "../lib/gameLogic";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress, Badge } from "./BaseComponents";
import { TrendingUp, Award, Brain, Target } from "lucide-react";

const ProgressTracker = () => {
  const [progress, setProgress] = useState(getProgress());
  const [stats, setStats] = useState(getStats());
  const [weeklyReport, setWeeklyReport] = useState(getWeeklyReport());

  // Update stats when localStorage changes
  useEffect(() => {
    const updateStats = () => {
      setProgress(getProgress());
      setStats(getStats());
      setWeeklyReport(getWeeklyReport());
    };

    // Listen for localStorage changes
    window.addEventListener("storage", updateStats);

    // Custom event for local updates
    window.addEventListener("statsUpdated", updateStats);

    // Poll for updates every second
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

  const recentIQ = progress.iqHistory.slice(-7);
  const iqTrend =
    recentIQ.length > 1 ? recentIQ[recentIQ.length - 1].iq - recentIQ[0].iq : 0;

  return (
    <div className="space-y-6">
      {/* IQ Progress */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="text-purple-400" />
              <span>IQ Progress</span>
            </div>
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(progress.averageIQ)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp
                className={`h-4 w-4 ${
                  iqTrend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              />
              <span
                className={`text-sm ${
                  iqTrend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {iqTrend >= 0 ? "+" : ""}
                {iqTrend} this week
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">IQ Range</span>
              <span className="text-white">70-200</span>
            </div>
            <Progress
              value={((progress.averageIQ - 70) / 130) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Report */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="text-green-400" />
            <span>This Week</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {weeklyReport.puzzlesSolved}
              </div>
              <p className="text-xs text-purple-200">Puzzles</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {accuracy.toFixed(0)}%
              </div>
              <p className="text-xs text-purple-200">Accuracy</p>
            </div>
          </div>

          <div className="space-y-2">
            {weeklyReport.improvements.map((improvement, index) => (
              <p key={index} className="text-sm text-purple-200">
                {improvement}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="text-yellow-400" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.achievements.length > 0 ? (
            <div className="space-y-3">
              {progress.achievements.slice(-3).map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <p className="text-yellow-300 font-semibold text-sm">
                      {achievement.title}
                    </p>
                    <p className="text-yellow-200 text-xs">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-purple-200 text-sm text-center py-4">
              Complete puzzles to earn achievements! 🏆
            </p>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Progress */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-sm">
            Difficulty Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(stats.byDifficulty).map(([difficulty, data]) => {
            const accuracy =
              data.solved > 0 ? (data.correct / data.solved) * 100 : 0;
            const colors = {
              easy: "text-green-400",
              medium: "text-yellow-400",
              hard: "text-orange-400",
              expert: "text-red-400",
            };

            return (
              <div key={difficulty} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${colors[difficulty]}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="text-purple-200 text-sm">
                    {data.solved} solved
                  </span>
                </div>
                <Progress value={accuracy} className="h-1" />
                <p className="text-xs text-purple-300 text-right">
                  {accuracy.toFixed(0)}% accuracy
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
