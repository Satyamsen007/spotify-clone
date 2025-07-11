import { connectDb } from "@/lib/db";
import { Playlist } from "@/models/playlist.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PATCH(req) {
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

    const { playlistId, songId } = await req.json();

    const playlist = await Playlist.findOne({ _id: playlistId });

    if (!playlist) {
      return NextResponse.json({
        success: false,
        message: "Playlist Not Found!"
      }, { status: 404 })
    }

    const result = await Playlist.updateOne(
      { _id: playlistId },
      {
        $push: {
          songs: songId
        }
      }
    );


    return NextResponse.json(
      {
        success: true,
        message: "Song added to playlist",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error While added the song to the playlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error While added the song to the playlist",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
