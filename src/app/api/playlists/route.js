import { connectDb } from "@/lib/db";
import { Playlist } from "@/models/playlist.model";
import { getServerSession } from "next-auth";
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

    const playlists = await Playlist.find({
      createdBy: session.user._id
    }).populate("songs")

    return NextResponse.json(
      {
        success: true,
        message: "All User Playlists fetched successfully",
        playlists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Playlists:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching Playlists",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
