import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const {
      questionText,
      correctAnswer,
      incorrectAns1,
      incorrectAns2,
      incorrectAns3,
      category,
      difficulty,
    } = await request.json();

    if (
      !questionText ||
      !correctAnswer ||
      !incorrectAns1 ||
      !incorrectAns2 ||
      !incorrectAns3 ||
      !category ||
      !difficulty
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get user ID from the request headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const connection = await getConnection();

    try {
      const [categoryRows] = await connection.execute(
        "SELECT CategoryID FROM Category WHERE Type = ?",
        [category]
      );

      if (!Array.isArray(categoryRows) || categoryRows.length === 0) {
        throw new Error("Invalid category");
      }

      const categoryId = (categoryRows[0] as any).CategoryID;

      // Insert the question into UserSubmission table
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO UserSubmission (
          UserID,
          QuestionText,
          CorrectAnswer,
          IncorrectAns1,
          IncorrectAns2,
          IncorrectAns3,
          Status,
          SubmissionDate,
          CategoryID,
          Difficulty
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseInt(userId),
          questionText,
          correctAnswer,
          incorrectAns1,
          incorrectAns2,
          incorrectAns3,
          0, // Unapproved
          new Date(),
          categoryId,
          difficulty,
        ]
      );

      return NextResponse.json({
        success: true,
        submissionId: result.insertId,
      });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to submit question" },
        { status: 500 }
      );
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
