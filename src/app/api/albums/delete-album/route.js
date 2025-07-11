import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Album } from "@/models/album.model";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth'
import { authOptions } from "../../auth/[...nextauth]/options";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function DELETE(req) {
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

    const { albumId } = await req.json();
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({
        success: false,
        message: "Album not found"
      }, { status: 404 });
    }
    // Delete song image from Cloudinary if exists
    if (album.imageUrl && album.imageUrl.includes('cloudinary')) {
      const urlParts = album.imageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const imagePublicId = publicIdWithExtension.split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    await album.deleteOne();
    return NextResponse.json({
      success: true,
      message: "Album deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.log("Got error while deleting an Album", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't delete an album",
      error: error.message
    }, { status: 500 })
  }
}
