import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const submissionId = parseInt(id);
    const requestBody = await request.json();

    const {
      QuestionText,
      CorrectAnswer,
      IncorrectAns1,
      IncorrectAns2,
      IncorrectAns3,
    } = requestBody;

    if (
      !QuestionText ||
      !CorrectAnswer ||
      !IncorrectAns1 ||
      !IncorrectAns2 ||
      !IncorrectAns3
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE UserSubmission 
         SET QuestionText = ?,
             CorrectAnswer = ?,
             IncorrectAns1 = ?,
             IncorrectAns2 = ?,
             IncorrectAns3 = ?
         WHERE SubmissionID = ?`,
        [
          QuestionText,
          CorrectAnswer,
          IncorrectAns1,
          IncorrectAns2,
          IncorrectAns3,
          submissionId,
        ]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update question" },
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

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const submissionId = parseInt(id);
    const connection = await getConnection();

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        "DELETE FROM UserSubmission WHERE SubmissionID = ?",
        [submissionId]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete question" },
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
