import { Playlist } from "@/models/playlist.model";
import { User } from "@/models/user.model";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
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

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    const authorizedUser = session?.user;

    const user = await User.findOne({ _id: authorizedUser._id });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User Not found please create account!"
      }, { status: 404 })
    }
    const userProfileImageUrl = user?.imageUrl;

    if (userProfileImageUrl && userProfileImageUrl.includes('cloudinary')) {
      const urlParts = userProfileImageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const imagePublicId = publicIdWithExtension.split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    const createdPlaylistsByAuthorizedUser = await Playlist.find({
      createdBy: user._id
    });

    for (const playlist of createdPlaylistsByAuthorizedUser) {
      const playlistImageUrl = playlist?.imageUrl;
      if (playlistImageUrl && playlistImageUrl.includes('cloudinary')) {
        const urlParts = playlistImageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
        const imagePublicId = publicIdWithExtension.split('.')[0];
        await cloudinary.uploader.destroy(imagePublicId);
      }
    }
    await Playlist.deleteMany({ createdBy: user._id });
    await user.deleteOne();

    return NextResponse.json({
      success: true,
      message: "User account and all associated data deleted successfully"
    }, { status: 200 })
  } catch (error) {
    console.error("Error in DELETE endpoint:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}