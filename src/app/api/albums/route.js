import { connectDb } from "@/lib/db";
import Album from "@/models/album.model.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();

    // Get 6 random albums
    const albums = await Album.aggregate([{ $sample: { size: 6 } }]);

    return NextResponse.json(
      {
        success: true,
        message: "Random albums fetched successfully",
        albums,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching albums",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
