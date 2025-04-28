import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // First check if username exists
      const [existingUsers] = await connection.execute(
        "SELECT COUNT(*) as count FROM User WHERE Username = ?",
        [username]
      );

      const count = (existingUsers as any)[0].count;
      if (count > 0) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }

      // If username is unique, create the user
      const [result] = await connection.execute(
        "CALL CreateNewUser(?, ?, ?, ?)",
        [username, email, password, new Date()]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
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
