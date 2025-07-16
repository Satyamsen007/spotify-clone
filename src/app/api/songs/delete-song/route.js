import { connectDb } from "@/lib/db";
import { Album } from "@/models/album.model";
import { Song } from "@/models/song.model";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function DELETE(req) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

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

    const { songId } = await req.json();

    if (!songId) {
      return NextResponse.json({
        success: false,
        message: "Song ID is required"
      }, { status: 400 });
    }

    const song = await Song.findById(songId);

    if (!song) {
      return NextResponse.json({
        success: false,
        message: "Song not found"
      }, { status: 404 });
    }

    // Delete song image from Cloudinary if exists
    if (song.imageUrl && song.imageUrl.includes('cloudinary')) {
      const urlParts = song.imageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const imagePublicId = publicIdWithExtension.split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    // Delete song audio from Cloudinary if exists
    if (song.songUrl && song.songUrl.includes('cloudinary')) {
      const uploadIndex = song.songUrl.indexOf('upload/') + 7;
      const pathAfterUpload = song.songUrl.slice(uploadIndex);
      const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
      const songPublicId = withoutVersion.split('.')[0];
      await cloudinary.uploader.destroy(songPublicId, {
        resource_type: "video",
        invalidate: true // Optional: clears CDN cache
      });
    }

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: {
          songs: song._id,
        }
      })
    }

    // Delete the song
    await song.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Song deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.log("Got error while deleting a Song", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't delete a song",
      error: error.message
    }, { status: 500 });
  }
}