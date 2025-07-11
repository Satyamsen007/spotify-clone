import { Song } from "@/models/song.model";
import { Album } from "@/models/album.model";
import { User } from "@/models/user.model";
import { connectDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from 'next-auth';
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.admin;

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    // Check if user is admin
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Forbidden - Admin access required"
      }, { status: 403 });
    }
    await connectDb();

    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),
      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: []
          }
        },
        {
          $group: {
            _id: "$artist"
          }
        },
        {
          $count: "count"
        }
      ])
    ]);

    return NextResponse.json({
      success: true,
      message: "Stats fetched successfully",
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0
    });
  } catch (error) {
    console.log("Error in fetching stats:", error);
    return NextResponse.json({
      success: false,
      message: "Error in fetching stats",
      error: error.message
    })
  }
}