import { connectDb } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDb();
  try {
    const { fullName, email, password } = await req.json();

    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      return NextResponse.json({
        success: false,
        message: "User already exists with this email"
      }, { status: 302 })
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      admin: email === "democoders2004@gmail.com",
      playlists: [],
      recentlyPlayed: [],
    });

    return Response.json({
      success: true,
      message: 'User registered successfully.',
      newUser
    }, { status: 200 });

  } catch (error) {
    console.error('Error while registering user', error);
    return Response.json({
      success: false,
      message: 'Error while registering user'
    }, { status: 500 });
  }
}