import { connectDb } from "@/lib/db";
import { Song } from "@/models/song.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const songs = await Song.aggregate([
      {
        $sample: {
          size: 8
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      message: "Trending Songs fetched successfully",
      songs
    }, { status: 201 })
  } catch (error) {
    console.log("Error in fetching Trending songs", error);
    return NextResponse.json({
      success: false,
      message: "Error in fetching Trending songs",
      error: error.message
    })
  }
}