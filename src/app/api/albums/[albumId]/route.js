import { connectDb } from "@/lib/db";
import Album from "@/models/album.model";
import { Song } from "@/models/song.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { albumId } = await params;
  try {
    await connectDb();
    const album = await Album.findById(albumId).populate({
      path: "songs",
      model: Song
    });

    if (!album) {
      return NextResponse.json({
        success: false,
        message: "Album not found",
      }, { status: 404 })
    }
    return NextResponse.json({
      success: true,
      message: "Single Album fetched successfully",
      album
    }, { status: 200 })
  } catch (error) {
    console.log("Error fetching ID based album:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching ID based album",
      error: error.message
    }, { status: 500 })
  }
}