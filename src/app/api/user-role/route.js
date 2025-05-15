// app/api/user-role/route.js (Next.js API Route)

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1]; // Bearer token
  if (!token) {
    return NextResponse.json({ message: "Invalid token format" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded has user data, e.g., { id, email, role, iat, exp }
    return NextResponse.json({ role: decoded.role });
  } catch (err) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
