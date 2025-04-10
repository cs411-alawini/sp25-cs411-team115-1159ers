import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, email } = await request.json();
    const connection = await getConnection();

    const [result] = await connection.execute(
      "INSERT INTO User (Username, Email, RegistrationDate, PasswordHash) VALUES (?, ?, ?, ?)",
      [username, email, new Date(), "password"]
    );

    // Get the inserted ID
    const userId = (result as any).insertId;

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
