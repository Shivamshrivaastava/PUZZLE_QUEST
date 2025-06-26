import { getProgress, getStats } from "../lib/localStorage";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress } from "./BaseComponents";

const StatsOverview = () => {
  const progress = getProgress();
  const stats = getStats();

  const accuracy =
    stats.totalPuzzlesSolved > 0
      ? (stats.correctAnswers / stats.totalPuzzlesSolved) * 100
      : 0;

  const statsCards = [
    {
      title: "Puzzles Solved",
      value: progress.puzzlesSolved,
      icon: "🎯",
      color: "text-blue-400",
    },
    {
      title: "Accuracy",
      value: `${Math.round(accuracy)}%`,
      icon: "✨",
      color: "text-green-400",
    },
    {
      title: "Current Streak",
      value: `${progress.streak} days`,
      icon: "🔥",
      color: "text-orange-400",
    },
    {
      title: "Best Streak",
      value: `${progress.longestStreak} days`,
      icon: "👑",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card
          key={index}
          className="glass-effect border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-sm text-purple-200 mt-1">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
