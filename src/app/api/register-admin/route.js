// src/app/api/auth/register-admin/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, email, password } = await req.json();

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ success: true, user: newAdmin }, { status: 201 });
  } catch (err) {
    console.error("Admin registration error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
