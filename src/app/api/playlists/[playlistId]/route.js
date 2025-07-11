import { connectDb } from "@/lib/db";
import { Playlist } from "@/models/playlist.model";
import { Song } from "@/models/song.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { playlistId } = await params;
  try {
    await connectDb();
    const playlist = await Playlist.findById(playlistId).populate({
      path: "songs",
      model: Song
    });

    if (!playlist) {
      return NextResponse.json({
        success: false,
        message: "Playlist not found",
      }, { status: 404 })
    }
    return NextResponse.json({
      success: true,
      message: "Single playlist fetched successfully",
      playlist
    }, { status: 200 })
  } catch (error) {
    console.log("Error fetching ID based playlist:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching ID based playlist",
      error: error.message
    }, { status: 500 })
  }
}