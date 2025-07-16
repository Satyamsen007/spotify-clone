import { connectDb } from "@/lib/db";
import { Song } from "@/models/song.model";
import { getServerSession } from 'next-auth';
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    await connectDb();

    const songs = await Song.find({}).sort({
      createdAt: -1
    });

    return NextResponse.json({
      success: true,
      message: "Songs fetched successfully",
      songs
    }, { status: 201 })
  } catch (error) {
    console.log("Error fetching songs:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching songs",
      error: error.message
    })
  }
}