"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserSubmission } from "@/lib/models";

export default function MyQuestions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<UserSubmission | null>(
    null
  );

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchQuestions();
  }, [router]);

  const fetchQuestions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`/api/my-questions?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (submissionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/my-questions/${submissionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      // Refresh the questions list
      fetchQuestions();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete question"
      );
    }
  };

  const handleUpdate = async (
    submissionId: number,
    updatedData: Partial<UserSubmission>
  ) => {
    try {
      const response = await fetch(`/api/my-questions/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      // Refresh the questions list
      fetchQuestions();
      setEditingQuestion(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update question"
      );
    }
  };

  const getStatusDisplay = (status: number) => {
    return status === 1 ? "Approved" : "Rejected";
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-500/80" : "bg-red-500/80";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl text-white text-center">
            Loading your questions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Questions</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center text-white/80 py-8">
              You haven't submitted any questions yet.
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.SubmissionID}
                className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl p-6 border border-white/20"
              >
                {editingQuestion?.SubmissionID === question.SubmissionID ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingQuestion.QuestionText}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          QuestionText: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingQuestion.CorrectAnswer}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            CorrectAnswer: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Correct Answer"
                      />
                      <input
                        type="text"
                        value={editingQuestion.IncorrectAns1}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            IncorrectAns1: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Incorrect Answer 1"
                      />
                      <input
                        type="text"
                        value={editingQuestion.IncorrectAns2}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            IncorrectAns2: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Incorrect Answer 2"
                      />
                      <input
                        type="text"
                        value={editingQuestion.IncorrectAns3}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            IncorrectAns3: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Incorrect Answer 3"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(question.SubmissionID, editingQuestion)
                        }
                        className="px-4 py-2 bg-blue-500/80 text-white rounded-md hover:bg-blue-600/80 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {question.QuestionText}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`text-sm ${getStatusColor(
                              question.Status
                            )} text-white px-2 py-1 rounded`}
                          >
                            {getStatusDisplay(question.Status)}
                          </span>
                          <span className="text-sm bg-white/20 text-white px-2 py-1 rounded">
                            Difficulty: {question.Difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(question.SubmissionID)}
                          className="px-3 py-1 bg-red-500/80 text-white rounded hover:bg-red-600/80 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-white/80">
                      <div>
                        <p className="font-semibold">Correct Answer:</p>
                        <p>{question.CorrectAnswer}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Incorrect Answers:</p>
                        <ul className="list-disc list-inside">
                          <li>{question.IncorrectAns1}</li>
                          <li>{question.IncorrectAns2}</li>
                          <li>{question.IncorrectAns3}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
