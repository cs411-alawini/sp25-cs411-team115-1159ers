import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { User } from "@/lib/models";

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM User");
    return NextResponse.json(rows as User[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
