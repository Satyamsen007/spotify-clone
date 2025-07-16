import { uploadImage } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db.js";
import { Album } from "@/models/album.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options.js";

export async function POST(req) {
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

    const formData = await req.formData();
    const title = formData.get("title");
    const artist = formData.get("artist");
    const releaseYear = formData.get("releaseYear");
    const imageFile = formData.get("image");

    if (!imageFile || !title || !artist || !releaseYear) {
      return NextResponse.json({
        success: false,
        message: "Please provide all required fields"
      }, { status: 400 })
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const secureImageUrl = await uploadImage(imageBuffer);

    if (!secureImageUrl) {
      return NextResponse.json({
        success: false,
        message: "Failed to upload image file"
      }, { status: 400 })
    }

    const album = await Album.create({
      title,
      artist,
      imageUrl: secureImageUrl,
      releaseYear,
    });

    return NextResponse.json({
      success: true,
      message: "Album Created Successfully",
      album,
    }, { status: 200 });

  } catch (error) {
    console.log("Got error while creating an Album", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't create an album",
      error: error.message
    }, { status: 500 })
  }
}