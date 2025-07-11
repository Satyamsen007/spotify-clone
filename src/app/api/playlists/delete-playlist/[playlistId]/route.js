import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession } from 'next-auth';
import { Playlist } from "@/models/playlist.model";
import { User } from "@/models/user.model";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    await connectDb();

    const { playlistId } = await params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      createdBy: session.user._id || session.user.id
    });

    if (!playlist) {
      return NextResponse.json({
        success: false,
        message: "Playlist not found"
      }, { status: 404 });
    }

    if (playlist.imageUrl && playlist.imageUrl.includes('cloudinary')) {
      const urlParts = playlist.imageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const imagePublicId = publicIdWithExtension.split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    await User.findByIdAndUpdate(
      session.user._id || session.user.id,
      {
        $pull: { playlists: playlist._id },
      }
    );

    await playlist.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Playlist deleted successfully",
      playlist
    }, { status: 200 });

  } catch (error) {
    console.log("Got error while deleting playlist:", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't delete the playlist",
      error: error.message
    }, { status: 500 });
  }
}