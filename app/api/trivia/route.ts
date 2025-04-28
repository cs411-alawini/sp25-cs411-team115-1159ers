import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter is required" },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();

    try {
      await connection.execute(`
        CREATE OR REPLACE VIEW CombinedQuestions AS
        SELECT
          'Official' as QuestionSource,
          q.QuestionID as ID,
          q.QuestionText,
          q.CorrectAnswer,
          q.IncorrectAns1,
          q.IncorrectAns2,
          q.IncorrectAns3,
          q.Difficulty,
          q.CategoryID
        FROM Question q
        JOIN Category c ON q.CategoryID = c.CategoryID

        UNION ALL

        SELECT
          'UserSubmitted' as QuestionSource,
          us.SubmissionID as ID,
          us.QuestionText,
          us.CorrectAnswer,
          us.IncorrectAns1,
          us.IncorrectAns2,
          us.IncorrectAns3,
          us.Difficulty,
          us.CategoryID
        FROM UserSubmission us
        JOIN Category c ON us.CategoryID = c.CategoryID
        WHERE us.Status = 1
      `);

      const [rows] = await connection.execute(
        `(SELECT * FROM CombinedQuestions
          WHERE CategoryID IN (
            SELECT CategoryID FROM Category WHERE Type = '${category}'
          ) AND Difficulty = 1
          ORDER BY RAND()
          LIMIT 4)

          UNION ALL

          (SELECT * FROM CombinedQuestions
          WHERE CategoryID IN (
            SELECT CategoryID FROM Category WHERE Type = '${category}'
          ) AND Difficulty = 2
          ORDER BY RAND()
          LIMIT 3)

          UNION ALL

          (SELECT * FROM CombinedQuestions
          WHERE CategoryID IN (
            SELECT CategoryID FROM Category WHERE Type = '${category}'
          ) AND Difficulty = 3
          ORDER BY RAND()
          LIMIT 3)`
      );

      return NextResponse.json(rows);
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch questions from database" },
        { status: 500 }
      );
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
