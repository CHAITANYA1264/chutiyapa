import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/mongodb";
import User from "@/models/User";  // your user mongoose model

export async function GET() {
  await connectionToDatabase();

  try {
    const users = await User.find({}, '-password'); // exclude password field
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
