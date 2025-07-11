import { connectDb } from "@/lib/db";
import { Playlist } from "@/models/playlist.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { uploadImage } from "@/lib/cloudinary";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login",
      }, { status: 401 });
    }

    await connectDb();

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");
    const { playlistId } = params; 

    if (!playlistId) {
      return NextResponse.json({
        success: false,
        message: "Playlist ID is required",
      }, { status: 400 });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      createdBy: session.user._id || session.user.id,
    });

    if (!playlist) {
      return NextResponse.json({
        success: false,
        message: "Playlist not found or you do not have permission",
      }, { status: 404 });
    }

    if (imageFile && imageFile instanceof File) {
      try {
        // Delete old image if it exists in Cloudinary
        if (playlist.imageUrl && playlist.imageUrl.includes('cloudinary')) {
          const urlParts = playlist.imageUrl.split('/');
          const uploadIndex = urlParts.indexOf('upload') + 2;
          if (uploadIndex < urlParts.length) {
            const publicIdWithExtension = urlParts.slice(uploadIndex).join('/');
            const imagePublicId = publicIdWithExtension.split('.')[0];
            await cloudinary.uploader.destroy(imagePublicId).catch(console.error);
          }
        }
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const secureImageUrl = await uploadImage(imageBuffer);
        playlist.imageUrl = secureImageUrl;
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        return NextResponse.json({
          success: false,
          message: "Error processing image",
        }, { status: 500 });
      }
    }

    if (title !== null && title !== undefined) playlist.title = title;
    if (description !== null && description !== undefined) playlist.description = description;

    await playlist.save();

    return NextResponse.json({
      success: true,
      message: "Playlist updated successfully",
      playlist,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating Playlist:", error);
    return NextResponse.json({
      success: false,
      message: "Error updating playlist",
      error: error.message,
    }, { status: 500 });
  }
}