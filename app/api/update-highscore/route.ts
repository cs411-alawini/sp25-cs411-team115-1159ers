import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface ProcedureResult extends RowDataPacket {
  error_message?: string;
}

export async function POST(request: Request) {
  try {
    const { userId, category, score } = await request.json();
    console.log("score:", score);

    if (!userId || !category || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // TODO: Implement the SQL procedure call to update high score
      // The procedure should:
      // 1. Check if user has an existing score for this category
      // 2. If yes, update only if new score is higher
      // 3. If no, insert new score
      const [result] = await connection.execute<ProcedureResult[]>(
        `
        CALL UpdateUserHighScore(?, ?, ?, ?)
      `,
        [userId, category === "CFB" ? 1 : 5, "Standard", score]
      );

      // Check if the procedure returned any error messages
      if (Array.isArray(result) && result.length > 0) {
        const errorMessage = result[0]?.error_message;
        if (errorMessage) {
          console.error("Procedure error:", errorMessage);
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update high score" },
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
