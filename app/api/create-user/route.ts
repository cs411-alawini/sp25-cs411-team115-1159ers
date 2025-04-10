import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const { username, email } = await request.json();
    const connection = await getConnection();

    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO User (Username, Email, RegistrationDate, PasswordHash) VALUES (?, ?, ?, ?)",
      [username, email, new Date(), "password"]
    );

    // Get the inserted ID
    const userId = result.insertId;

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      {
        error: `Failed to create user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
