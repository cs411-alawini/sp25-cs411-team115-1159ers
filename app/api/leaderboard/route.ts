import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category || (category !== "CFB" && category !== "NFL")) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const connection = await getConnection();

    try {
      const [rows] = await connection.execute(
        `
        select u.Username, uhs.HighScore
        from UserHighScore uhs
        inner join User u on uhs.UserID = u.UserID
        inner join Category c on uhs.CategoryID = c.CategoryID
        where c.Type = ?
        order by uhs.HighScore desc
        limit 10;
      `,
        [category]
      );
      return NextResponse.json(rows);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
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
