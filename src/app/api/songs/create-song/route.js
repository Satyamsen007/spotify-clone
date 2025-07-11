import { uploadAudio, uploadImage } from "@/lib/cloudinary";
import { Album } from "@/models/album.model";
import { Song } from "@/models/song.model";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from 'next-auth';
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
    const duration = formData.get("duration");
    const albumId = formData.get("albumId");
    const audioFile = formData.get("audio");
    const imageFile = formData.get("image");

    if (!audioFile || !imageFile || !title || !artist || !duration) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields"
      }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to Cloudinary
    const secureAudioUrl = await uploadAudio(audioBuffer);
    const secureImageUrl = await uploadImage(imageBuffer);

    if (!secureImageUrl) {
      return NextResponse.json({
        success: false,
        message: "Failed to upload image file"
      }, { status: 400 })
    } else if (!secureAudioUrl) {
      return NextResponse.json({
        success: false,
        message: "Failed to upload audio file"
      }, { status: 400 })
    }

    const song = await Song.create({
      title,
      artist,
      audioUrl: secureAudioUrl,
      imageUrl: secureImageUrl,
      duration,
      albumId: albumId || null
    });

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: {
          songs: song._id,
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Song Added Successfully",
      song,
    }, { status: 200 })

  } catch (error) {
    console.log("Got error while creating a Song", error);
    return NextResponse.json({
      success: false,
      message: "Couldn't create a song",
      error: error.message
    }, { status: 500 })
  }
}