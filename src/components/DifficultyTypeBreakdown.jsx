import { useState, useEffect } from "react";
import { getStats } from "../lib/localStorage";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress, Badge } from "./BaseComponents";
import { Target, Brain, TrendingUp } from "lucide-react";

const DifficultyTypeBreakdown = () => {
  const [stats, setStats] = useState(getStats());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Update stats when localStorage changes
  useEffect(() => {
    const updateStats = () => {
      setStats(getStats());
      setLastUpdate(Date.now());
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

  // Calculate difficulty breakdown with enhanced stats
  const difficultyStats = Object.entries(stats.byDifficulty).map(
    ([difficulty, data]) => {
      const accuracy = data.solved > 0 ? (data.correct / data.solved) * 100 : 0;
      const totalContribution =
        stats.totalPuzzlesSolved > 0
          ? (data.solved / stats.totalPuzzlesSolved) * 100
          : 0;

      return {
        difficulty,
        ...data,
        accuracy,
        contribution: totalContribution,
        color:
          {
            easy: "text-green-400",
            medium: "text-yellow-400",
            hard: "text-orange-400",
            expert: "text-red-400",
          }[difficulty] || "text-gray-400",
        bgColor:
          {
            easy: "bg-green-500/10 border-green-500/20",
            medium: "bg-yellow-500/10 border-yellow-500/20",
            hard: "bg-orange-500/10 border-orange-500/20",
            expert: "bg-red-500/10 border-red-500/20",
          }[difficulty] || "bg-gray-500/10 border-gray-500/20",
      };
    },
  );

  // Calculate type breakdown with enhanced stats
  const typeStats = Object.entries(stats.byType).map(([type, data]) => {
    const accuracy = data.solved > 0 ? (data.correct / data.solved) * 100 : 0;
    const totalContribution =
      stats.totalPuzzlesSolved > 0
        ? (data.solved / stats.totalPuzzlesSolved) * 100
        : 0;

    return {
      type,
      ...data,
      accuracy,
      contribution: totalContribution,
      icon:
        {
          logic: "🧠",
          math: "🔢",
          word: "📝",
          pattern: "🎨",
        }[type] || "🧩",
    };
  });

  const formatLastUpdate = () => {
    const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Difficulty Breakdown */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="text-red-400" />
              <span>Difficulty Mastery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">
                {formatLastUpdate()}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {difficultyStats.map((stat) => (
            <div
              key={stat.difficulty}
              className={`p-4 rounded-lg border ${stat.bgColor}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold capitalize ${stat.color}`}>
                    {stat.difficulty}
                  </span>
                  <Badge variant="outline" className="text-purple-300 text-xs">
                    {stat.solved} solved
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-300">
                    {stat.contribution.toFixed(1)}% of total
                  </div>
                </div>
              </div>
              <Progress value={stat.accuracy} className="h-2" />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>{stat.correct} correct</span>
                <span>{stat.solved - stat.correct} incorrect</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Type Breakdown */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="text-purple-400" />
              <span>Type Expertise</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {typeStats.map((stat) => (
            <div
              key={stat.type}
              className="p-4 rounded-lg bg-white/5 border border-purple-500/20"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="font-bold capitalize text-white">
                    {stat.type}
                  </span>
                  <Badge variant="outline" className="text-purple-300 text-xs">
                    {stat.solved} solved
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    {stat.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-300">
                    {stat.contribution.toFixed(1)}% of total
                  </div>
                </div>
              </div>
              <Progress value={stat.accuracy} className="h-2" />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>{stat.correct} correct</span>
                <span>{stat.solved - stat.correct} incorrect</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DifficultyTypeBreakdown;
