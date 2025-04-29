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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await fetch(
        `/api/search-users?query=${encodeURIComponent(
          searchQuery
        )}&category=${activeTab}`
      );
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearchLoading(false);
    }
  };

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

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="flex-1 px-4 py-2 bg-white/20 text-white rounded-md border border-white/30 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Search Results
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-left">Username</th>
                      <th className="py-3 px-4 text-right">High Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="py-3 px-4">{entry.Username}</td>
                        <td className="py-3 px-4 text-right">
                          {entry.HighScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
