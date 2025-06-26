import { getProgress } from "../lib/localStorage";
import { Badge, Progress } from "./BaseComponents";
import { getXPForNextLevel } from "../lib/gameLogic";

const Header = ({ user }) => {
  const progress = getProgress();
  const nextLevelXP = getXPForNextLevel(progress.level);
  const currentLevelXP =
    progress.level > 1 ? getXPForNextLevel(progress.level - 1) : 0;
  const xpProgress =
    ((progress.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) *
    100;

  return (
    <header className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🧩</div>
            <div>
              <h1 className="text-xl font-bold text-white">Puzzle Quest</h1>
              <p className="text-sm text-purple-200">Daily Brain Challenge</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex items-center space-x-6">
            {/* Level */}
            <div className="text-center">
              <Badge className="puzzle-gradient text-white font-bold">
                Level {progress.level}
              </Badge>
              <div className="w-24 mt-1">
                <Progress value={xpProgress} className="h-2" />
              </div>
              <p className="text-xs text-purple-200 mt-1">
                {progress.totalXP - currentLevelXP} /{" "}
                {nextLevelXP - currentLevelXP} XP
              </p>
            </div>

            {/* Streak */}
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-white font-bold">{progress.streak}</span>
              </div>
              <p className="text-xs text-purple-200">day streak</p>
            </div>

            {/* IQ Score */}
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <span className="text-purple-400">🧠</span>
                <span className="text-white font-bold">
                  {Math.round(progress.averageIQ)}
                </span>
              </div>
              <p className="text-xs text-purple-200">IQ Score</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
