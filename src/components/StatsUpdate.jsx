import { Card, CardContent } from "./Card";
import { Badge } from "./BaseComponents";
import { TrendingUp, TrendingDown, Target, Zap, Trophy } from "lucide-react";

const StatsUpdate = ({ result, isVisible }) => {
  if (!isVisible || !result?.stats) return null;

  const { stats, isCorrect, points } = result;

  return (
    <Card className="glass-effect border-purple-500/20 animate-slide-up">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          {/* Result Header */}
          <div className="flex items-center justify-center space-x-2">
            {isCorrect ? (
              <>
                <div className="text-2xl">✅</div>
                <span className="text-green-400 font-bold">Correct!</span>
                <Badge className="bg-green-500/20 text-green-400">
                  +{points} XP
                </Badge>
              </>
            ) : (
              <>
                <div className="text-2xl">❌</div>
                <span className="text-red-400 font-bold">Incorrect</span>
                <Badge className="bg-red-500/20 text-red-400">No XP</Badge>
              </>
            )}
          </div>

          {/* Updated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-purple-500/20">
            {/* Total Solved */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-lg font-bold text-blue-400">
                  {stats.totalSolved}
                </span>
              </div>
              <p className="text-xs text-purple-200">Total Solved</p>
            </div>

            {/* Accuracy */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                {stats.accuracy >= stats.previousAccuracy ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span
                  className={`text-lg font-bold ${
                    stats.accuracy >= stats.previousAccuracy
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stats.accuracy.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-purple-200">Accuracy</p>
            </div>

            {/* Session Streak */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">
                  {stats.currentSessionStreak}
                </span>
              </div>
              <p className="text-xs text-purple-200">Session Streak</p>
            </div>

            {/* Daily Streak */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Trophy className="h-4 w-4 text-orange-400" />
                <span className="text-lg font-bold text-orange-400">
                  {stats.dailyStreak}
                </span>
              </div>
              <p className="text-xs text-purple-200">Daily Streak</p>
            </div>
          </div>

          {/* Session Performance Highlights */}
          <div className="pt-2 border-t border-purple-500/20">
            <div className="text-xs text-purple-200 space-y-1">
              {isCorrect && stats.currentSessionStreak > 1 && (
                <p className="text-green-400">
                  🔥 {stats.currentSessionStreak} correct in a row!
                </p>
              )}
              {!isCorrect && (
                <p className="text-yellow-400">
                  💪 Keep going! Session streak reset to 0
                </p>
              )}
              {stats.currentSessionStreak === stats.bestSessionStreak &&
                stats.currentSessionStreak > 0 && (
                  <p className="text-purple-400">🏆 New best session streak!</p>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsUpdate;
