import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface UserSubmissionRow extends RowDataPacket {
  SubmissionID: number;
  UserID: number;
  QuestionText: string;
  CorrectAnswer: string;
  IncorrectAns1: string;
  IncorrectAns2: string;
  IncorrectAns3: string;
  Status: string;
  SubmissionDate: Date;
  CategoryID: number;
  Difficulty: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const [rows] = await connection.execute<UserSubmissionRow[]>(
        `SELECT * FROM UserSubmission WHERE UserID = ? ORDER BY SubmissionDate DESC`,
        [parseInt(userId)]
      );

      return NextResponse.json(rows);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch questions" },
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
