import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { HighScore } from "@/lib/models";
import { RowDataPacket } from "mysql2";

interface UserHighScoreResult extends HighScore, RowDataPacket {
  Username: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const category = searchParams.get("category");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const [rows] = await connection.execute<UserHighScoreResult[]>(
        `SELECT u.Username, uhs.HighScore, uhs.CategoryID
         FROM User u
         JOIN UserHighScore uhs ON u.UserID = uhs.UserID
         WHERE u.Username LIKE ? AND uhs.CategoryID = ?
         ORDER BY uhs.HighScore DESC
         LIMIT 10`,
        [`%${query}%`, category === "NFL" ? 1 : 2]
      );

      return NextResponse.json(rows);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to search users" },
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
