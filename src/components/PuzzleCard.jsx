import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import Button from "./Button";
import { Badge, RadioGroup, RadioGroupItem, Label } from "./BaseComponents";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import StatsUpdate from "./StatsUpdate";

const PuzzleCard = ({
  puzzle,
  puzzleNumber,
  isCompleted,
  completedData,
  onAnswerSubmit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResult, setShowResult] = useState(isCompleted);
  const [answerResult, setAnswerResult] = useState(null);
  const [showStatsUpdate, setShowStatsUpdate] = useState(false);

  useEffect(() => {
    if (!isCompleted && !timeStarted) {
      setTimeStarted(Date.now());
    }
  }, [isCompleted, timeStarted]);

  useEffect(() => {
    if (timeStarted && !isCompleted) {
      const interval = setInterval(() => {
        setTimeElapsed(Date.now() - timeStarted);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeStarted, isCompleted]);

  const handleSubmit = () => {
    if (!selectedAnswer || !puzzle?.id) return;

    const timeTaken = Math.floor((Date.now() - timeStarted) / 1000);
    const result = onAnswerSubmit(
      puzzle.id,
      parseInt(selectedAnswer),
      timeTaken,
    );

    setAnswerResult(result);
    setShowResult(true);
    setShowStatsUpdate(true);

    // Hide stats update after 5 seconds
    setTimeout(() => {
      setShowStatsUpdate(false);
    }, 5000);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
      : `${remainingSeconds}s`;
  };

  const getTypeIcon = (type) => {
    const icons = {
      logic: "🧠",
      math: "🔢",
      word: "📝",
      pattern: "🎨",
    };
    return icons[type] || "🧩";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-green-500/20 text-green-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      hard: "bg-orange-500/20 text-orange-400",
      expert: "bg-red-500/20 text-red-400",
    };
    return colors[difficulty] || colors.medium;
  };

  return (
    <Card className="glass-effect border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {getTypeIcon(puzzle?.type || "logic")}
            </span>
            <div>
              <h3 className="text-lg">Puzzle {puzzleNumber}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className={getDifficultyColor(puzzle?.difficulty || "medium")}
                >
                  {puzzle?.difficulty
                    ? puzzle.difficulty.charAt(0).toUpperCase() +
                      puzzle.difficulty.slice(1)
                    : "Medium"}
                </Badge>
                <Badge variant="outline" className="text-purple-300">
                  {puzzle?.points || 25} XP
                </Badge>
              </div>
            </div>
          </div>

          {isCompleted ? (
            <div className="flex items-center space-x-2">
              {completedData?.isCorrect ? (
                <CheckCircle className="text-green-400" />
              ) : (
                <XCircle className="text-red-400" />
              )}
              <span className="text-sm text-purple-200">
                {formatTime(completedData?.timeTaken * 1000 || 0)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-purple-200">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(timeElapsed)}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white text-lg leading-relaxed">
            {puzzle?.question || "Loading puzzle question..."}
          </p>
        </div>

        {/* Options */}
        {!isCompleted ? (
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {(puzzle?.options || []).map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${puzzle?.id || "puzzle"}-${index}`}
                  className="border-purple-400 text-purple-400"
                />
                <Label
                  htmlFor={`option-${puzzle?.id || "puzzle"}-${index}`}
                  className="text-purple-100 cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {(puzzle?.options || []).map((option, index) => {
              const isCorrect = index === puzzle?.correctAnswer;
              const isUserAnswer = index === completedData?.answer;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    isCorrect
                      ? "border-green-400 bg-green-400/10"
                      : isUserAnswer && !isCorrect
                        ? "border-red-400 bg-red-400/10"
                        : "border-gray-600"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isCorrect && (
                      <CheckCircle className="text-green-400 h-5 w-5" />
                    )}
                    {isUserAnswer && !isCorrect && (
                      <XCircle className="text-red-400 h-5 w-5" />
                    )}
                    <span
                      className={`${
                        isCorrect
                          ? "text-green-300"
                          : isUserAnswer && !isCorrect
                            ? "text-red-300"
                            : "text-purple-200"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        {!isCompleted && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full puzzle-gradient text-white font-semibold hover:scale-105 transition-transform"
          >
            Submit Answer
          </Button>
        )}

        {/* Stats Update - Shows immediately after answering */}
        {showStatsUpdate && answerResult && (
          <StatsUpdate result={answerResult} isVisible={showStatsUpdate} />
        )}

        {/* Explanation */}
        {showResult && puzzle?.explanation && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Explanation:</h4>
            <p className="text-blue-100 text-sm">{puzzle.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleCard;
