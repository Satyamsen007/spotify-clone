import { connectDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { User } from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


export async function PATCH(req) {
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
    const fullName = formData.get("fullName");
    const imageFile = formData.get("image");

    const user = await User.findOne({
      _id: session?.user?._id,
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found!",
      }, { status: 404 });
    }


    if (imageFile && imageFile instanceof File) {
      // Delete old image if it exists in Cloudinary
      if (user.imageUrl && user.imageUrl.includes('cloudinary')) {
        const urlParts = user.imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload') + 2;
        if (uploadIndex < urlParts.length) {
          const publicIdWithExtension = urlParts.slice(uploadIndex).join('/');
          const imagePublicId = publicIdWithExtension.split('.')[0];
          await cloudinary.uploader.destroy(imagePublicId).catch(console.error);
        }
      }
      
      const imageBuffer = Buffer.from(await imageFile?.arrayBuffer());
      const secureImageUrl = await uploadImage(imageBuffer);
      user.imageUrl = secureImageUrl
    }

    if (fullName) user.fullName = fullName;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json({
      success: false,
      message: "Error updating User",
      error: error.message,
    }, { status: 500 });
  }
}
