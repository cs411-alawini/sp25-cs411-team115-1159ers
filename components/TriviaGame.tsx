"use client";

import { useState, useEffect } from "react";
import { Question } from "@/lib/models";

interface TriviaGameProps {
  category: string;
  categoryName: string;
  onGameEnd: () => Promise<void>;
  onScoreUpdate: (score: number) => void;
}

export default function TriviaGame({
  category,
  categoryName,
  onGameEnd,
  onScoreUpdate,
}: TriviaGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/trivia?category=${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  const currentQuestion = questions[currentQuestionIndex];

  // Shuffle answers only when the question changes
  useEffect(() => {
    if (currentQuestion) {
      const answers = [
        currentQuestion.CorrectAnswer,
        currentQuestion.IncorrectAns1,
        currentQuestion.IncorrectAns2,
        currentQuestion.IncorrectAns3,
      ];
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion]);

  const handleAnswer = (selectedAnswer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(selectedAnswer);
    const isCorrect = selectedAnswer === currentQuestion.CorrectAnswer;
    if (isCorrect) {
      const newScore = score + 100;
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
        onGameEnd();
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-2xl text-white font-bold">
          Loading questions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-xl text-red-400 font-bold">{error}</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl p-8 max-w-md w-full border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-6 text-white">
            Game Over!
          </h2>
          <p className="text-2xl text-center mb-8 text-white">
            Final Score: {score} points
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-bold text-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-xl text-white font-bold">
          No questions available.
        </div>
      </div>
    );
  }

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {categoryName} Trivia
          </h1>
          <div className="flex justify-between items-center">
            <span className="text-lg text-white/80">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm ${getDifficultyColor(
                  currentQuestion.Difficulty
                )} text-white px-3 py-1 rounded-full font-semibold`}
              >
                {getDifficultyLabel(currentQuestion.Difficulty)} (
                {currentQuestion.Difficulty * 100} pts)
              </span>
              <span className="text-xl font-bold text-white">
                Score: {score}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-8 text-white">
            {currentQuestion.QuestionText}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                disabled={isAnswered}
                className={`p-4 text-left rounded-lg transition-all transform hover:scale-102 ${
                  !isAnswered
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : selectedAnswer === answer
                    ? answer === currentQuestion.CorrectAnswer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : answer === currentQuestion.CorrectAnswer
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
