import { NextResponse } from "next/server";
import connectionToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  const { id } = params;
  await connectionToDatabase();

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to get user", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  await connectionToDatabase();

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { username, email, role, password } = body;

    // Build update object
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    if (password) {
      // TODO: hash password before saving in production!
      updateFields.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true }).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Failed to update user", error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await connectionToDatabase();

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete user", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
