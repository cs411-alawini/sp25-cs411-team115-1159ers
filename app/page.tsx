"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      // Get username from localStorage
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white">Sports Trivia</h1>
          {username && (
            <p className="text-white/80 mt-1">Welcome, {username}!</p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/my-questions")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            My Questions
          </button>
          <button
            onClick={() => router.push("/submit-question")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Submit Question
          </button>
          <button
            onClick={() => router.push("/leaderboard")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Leaderboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-600/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8 text-white">
          Choose Your Trivia Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => router.push("/trivia?category=CFB")}
            className="group relative h-64 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
              <h3 className="text-3xl font-bold mb-4">College Football</h3>
              <p className="text-lg text-center opacity-90">
                Test your knowledge of college football history, teams, and
                players
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/trivia?category=NFL")}
            className="group relative h-64 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
              <h3 className="text-3xl font-bold mb-4">NFL</h3>
              <p className="text-lg text-center opacity-90">
                Challenge yourself with NFL trivia questions about teams,
                players, and history
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
