"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/textfield";

export default function SubmitQuestion() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    questionText: "",
    correctAnswer: "",
    incorrectAns1: "",
    incorrectAns2: "",
    incorrectAns3: "",
    category: "NFL",
    difficulty: "1",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to submit a question");
      return;
    }

    try {
      const response = await fetch("/api/submit-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          ...formData,
          difficulty: parseInt(formData.difficulty),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit question");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit question. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Submit a Question</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl p-8 border border-white/20">
          {success ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Question Submitted!
              </h2>
              <p className="text-white/80">Redirecting to home page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <TextField
                  label="Question"
                  placeholder="Enter your question"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                  required
                />

                <TextField
                  label="Correct Answer"
                  placeholder="Enter the correct answer"
                  value={formData.correctAnswer}
                  onChange={(e) =>
                    setFormData({ ...formData, correctAnswer: e.target.value })
                  }
                  required
                />

                <TextField
                  label="Incorrect Answer 1"
                  placeholder="Enter an incorrect answer"
                  value={formData.incorrectAns1}
                  onChange={(e) =>
                    setFormData({ ...formData, incorrectAns1: e.target.value })
                  }
                  required
                />

                <TextField
                  label="Incorrect Answer 2"
                  placeholder="Enter an incorrect answer"
                  value={formData.incorrectAns2}
                  onChange={(e) =>
                    setFormData({ ...formData, incorrectAns2: e.target.value })
                  }
                  required
                />

                <TextField
                  label="Incorrect Answer 3"
                  placeholder="Enter an incorrect answer"
                  value={formData.incorrectAns3}
                  onChange={(e) =>
                    setFormData({ ...formData, incorrectAns3: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="NFL">NFL</option>
                      <option value="CFB">College Football</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({ ...formData, difficulty: e.target.value })
                      }
                      className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="1">Easy</option>
                      <option value="2">Medium</option>
                      <option value="3">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-bold"
              >
                Submit Question
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
