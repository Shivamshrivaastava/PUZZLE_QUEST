import { useState, useEffect } from "react";
import {
  getDailyPuzzles,
  saveDailyPuzzles,
  markPuzzleCompleted,
  getUser,
  isNewDay,
} from "../lib/localStorage";
import { generateDailyPuzzles } from "../lib/gemini";
import { processAnswer, completeDailyChallenge } from "../lib/gameLogic";
import PuzzleCard from "./PuzzleCard";
import Button from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { toast } from "sonner";
import { RefreshCw, Trophy } from "lucide-react";

const DailyPuzzles = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  useEffect(() => {
    loadDailyPuzzles();
  }, []);

  const loadDailyPuzzles = async () => {
    setLoading(true);
    try {
      console.log("Loading daily puzzles...");
      let dailyData = getDailyPuzzles();
      const user = getUser();

      console.log("Daily data:", dailyData);
      console.log("User:", user);
      console.log("Is new day:", isNewDay());

      // Check if we need new puzzles
      if (!dailyData || isNewDay()) {
        console.log("Generating new daily puzzles...");
        await generateNewPuzzles(false, "daily"); // Daily mode for consistent daily challenge
      } else {
        console.log("Using existing puzzles:", dailyData.puzzles);
        setPuzzles(dailyData.puzzles);
        setCompletedPuzzles(dailyData.completed || []);
        setAllCompleted(
          dailyData.completed?.length >= dailyData.puzzles.length,
        );
      }
    } catch (error) {
      console.error("Error loading puzzles:", error);
      toast.error("Failed to load puzzles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateNewPuzzles = async (useAI = false, puzzleMode = "practice") => {
    setGenerating(true);
    try {
      const user = getUser();
      console.log("Generating puzzles for user:", user);
      const difficulty = puzzleMode === "daily" ? "medium" : selectedDifficulty;
      const newPuzzles = await generateDailyPuzzles(
        difficulty,
        user?.id || "guest",
        useAI,
        puzzleMode,
      );

      console.log("Generated puzzles:", newPuzzles);

      if (newPuzzles && newPuzzles.length > 0) {
        setPuzzles(newPuzzles);
        setCompletedPuzzles([]);
        setAllCompleted(false);
        saveDailyPuzzles(newPuzzles);
        if (useAI) {
          toast.success("New AI-generated puzzles created!");
        } else {
          toast.success("New daily puzzles ready!");
        }
      } else {
        console.error("No puzzles generated");
        toast.error("Failed to generate puzzles. Please try again.");
      }
    } catch (error) {
      console.error("Error generating puzzles:", error);
      toast.error("Failed to generate puzzles. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSubmit = (puzzleId, selectedAnswer, timeTaken) => {
    const puzzle = puzzles.find((p) => p.id === puzzleId);
    if (!puzzle) return null;

    const result = processAnswer(puzzle, selectedAnswer, timeTaken);
    const isCorrect = result.isCorrect;

    // Mark puzzle as completed
    markPuzzleCompleted(puzzleId, selectedAnswer, isCorrect, timeTaken);

    // Update local state
    const newCompleted = [
      ...completedPuzzles,
      {
        puzzleId,
        answer: selectedAnswer,
        isCorrect,
        timeTaken,
        completedAt: new Date().toISOString(),
      },
    ];
    setCompletedPuzzles(newCompleted);

    // Show simplified toast (stats are shown in PuzzleCard now)
    if (isCorrect) {
      toast.success(`Correct! +${result.points} XP 🎉`);
    } else {
      toast.error("Incorrect answer ❌");
    }

    // Check if all puzzles completed
    if (newCompleted.length >= puzzles.length) {
      setAllCompleted(true);
      const challengeResult = completeDailyChallenge();
      toast.success(
        `Daily challenge complete! +${challengeResult.bonusXP} bonus XP`,
        {
          description: `Streak: ${challengeResult.streak} days`,
        },
      );
    }

    // Return the result so PuzzleCard can display stats
    return result;
  };

  if (loading) {
    return (
      <Card className="glass-effect border-purple-500/20">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4 animate-spin">🧩</div>
          <p className="text-purple-200">Loading today's puzzles...</p>
        </CardContent>
      </Card>
    );
  }

  if (allCompleted) {
    return (
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
            <Trophy className="text-yellow-400" />
            <span>Daily Challenge Complete!</span>
            <Trophy className="text-yellow-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
          <p className="text-purple-200 text-lg">
            Congratulations! You've completed all today's puzzles.
          </p>
          <p className="text-sm text-purple-300">
            Come back tomorrow for new challenges!
          </p>
          <div className="space-y-4">
            {/* Difficulty Selector */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-purple-200 text-sm">
                Practice Difficulty:
              </span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-purple-900/50 border border-purple-500/30 rounded-md px-3 py-1 text-purple-200 text-sm"
              >
                <option value="easy">Easy (10 XP)</option>
                <option value="medium">Medium (25 XP)</option>
                <option value="hard">Hard (50 XP)</option>
                <option value="expert">Expert (100 XP)</option>
              </select>
            </div>

            {/* Generate Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => generateNewPuzzles(false, "practice")}
                disabled={generating}
                className="puzzle-gradient text-white"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`}
                />
                {generating
                  ? "Generating..."
                  : `New ${selectedDifficulty} Practice`}
              </Button>
              <Button
                onClick={() => generateNewPuzzles(true, "practice")}
                disabled={generating}
                variant="outline"
                className="border-purple-400 text-purple-200 hover:bg-purple-400/10"
              >
                🤖 Generate AI Puzzles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Today's Brain Challenge</span>
            <span className="text-sm bg-purple-500/20 px-2 py-1 rounded">
              {completedPuzzles.length}/{puzzles.length} completed
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {puzzles.map((puzzle, index) => {
          const isCompleted = completedPuzzles.some(
            (cp) => cp.puzzleId === puzzle.id,
          );
          const completedData = completedPuzzles.find(
            (cp) => cp.puzzleId === puzzle.id,
          );

          return (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              puzzleNumber={index + 1}
              isCompleted={isCompleted}
              completedData={completedData}
              onAnswerSubmit={handleAnswerSubmit}
            />
          );
        })}
      </div>

      {puzzles.length === 0 && (
        <Card className="glass-effect border-purple-500/20">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-purple-200">No puzzles available.</p>
            <div className="space-y-4">
              {/* Difficulty Selector */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-purple-200 text-sm">
                  Choose Difficulty:
                </span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-purple-900/50 border border-purple-500/30 rounded-md px-3 py-1 text-purple-200 text-sm"
                >
                  <option value="easy">Easy (10 XP)</option>
                  <option value="medium">Medium (25 XP)</option>
                  <option value="hard">Hard (50 XP)</option>
                  <option value="expert">Expert (100 XP)</option>
                </select>
              </div>

              {/* Generate Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => generateNewPuzzles(false, "practice")}
                  disabled={generating}
                  className="puzzle-gradient text-white"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`}
                  />
                  {generating
                    ? "Generating..."
                    : `Get ${selectedDifficulty} Puzzles`}
                </Button>
                <Button
                  onClick={() => generateNewPuzzles(true, "practice")}
                  disabled={generating}
                  variant="outline"
                  className="border-purple-400 text-purple-200 hover:bg-purple-400/10"
                >
                  🤖 Try AI Puzzles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyPuzzles;
