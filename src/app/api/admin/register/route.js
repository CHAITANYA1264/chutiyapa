import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectionToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env

export async function POST(request) {
  await connectionToDatabase();

  // Parse JSON body
  const { username, email, password, role } = await request.json();

  if (!username || !email || !password || !role) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Verify JWT token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Check admin role
  if (decoded.role !== "admin") {
    return NextResponse.json({ message: "Access denied: admin only" }, { status: 403 });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();

  return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
