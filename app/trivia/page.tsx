"use client";

import { useSearchParams } from "next/navigation";
import TriviaGame from "@/components/TriviaGame";
import { useState } from "react";

export default function TriviaPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const getCategoryName = (category: string) => {
    return category === "NFL" ? "NFL" : "College Football";
  };

  const handleGameEnd = async () => {
    try {
      // Update high score
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch("/api/update-highscore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            category: searchParams.get("category"),
            score: score,
          }),
        });

        if (!response.ok) {
          console.error("Failed to update high score");
        }
      }

      // Show game over modal
      setShowGameOver(true);
    } catch (error) {
      console.error("Error updating high score:", error);
      setShowGameOver(true);
    }
  };

  if (!category) {
    return <div>Category is required</div>;
  }

  return (
    <TriviaGame
      categoryName={getCategoryName(category)}
      category={category}
      onGameEnd={handleGameEnd}
      onScoreUpdate={setScore}
    />
  );
}
