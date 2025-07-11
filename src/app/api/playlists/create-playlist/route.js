import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from 'next-auth';
import { Playlist } from "@/models/playlist.model";
import { User } from "@/models/user.model";

export async function POST(req) {
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

    const { title: playListTitle } = await req.json()

    const userId = session.user._id || session.user.id;
    const count = await Playlist.countDocuments({ createdBy: userId });

    const title = `My Playlist #${count + 1}`;

    const playlist = await Playlist.create({
      title: playListTitle ? playListTitle : title,
      description: '',
      createdBy: userId,
      songs: [],
      imageUrl: "",
    });

    await User.findByIdAndUpdate(userId, {
      $push: { playlists: playlist._id }
    });


    return NextResponse.json({
      success: true,
      message: "Playlist Created Successfully",
      playlist,
    }, { status: 200 })
  } catch (error) {
    console.log("Got error while creating an Playlist", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't create an playlist",
      error: error.message
    }, { status: 500 })
  }
}