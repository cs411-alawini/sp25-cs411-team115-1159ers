"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LeaderboardEntry {
  Username: string;
  HighScore: number;
}

export default function Leaderboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"CFB" | "NFL">("CFB");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaderboard?category=${activeTab}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("CFB")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "CFB"
                  ? "bg-blue-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              College Football
            </button>
            <button
              onClick={() => setActiveTab("NFL")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "NFL"
                  ? "bg-blue-500 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              NFL
            </button>
          </div>

          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-4 text-left">Rank</th>
                    <th className="py-3 px-4 text-left">Username</th>
                    <th className="py-3 px-4 text-right">High Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{entry.Username}</td>
                      <td className="py-3 px-4 text-right">
                        {entry.HighScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
