import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { User } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const [rows] = await connection.execute<User[]>(
        "SELECT * FROM User WHERE Username = ? AND PasswordHash = ?",
        [username, password]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }

      const user = rows[0];

      // In a real app, you'd want to use a proper session management system
      // For now, we'll just return the user ID and username
      return NextResponse.json({
        success: true,
        user: {
          id: user.UserID,
          username: user.Username,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to authenticate" },
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
