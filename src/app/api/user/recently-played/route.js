import { User } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    const authorizedUser = session?.user;

    const user = await User.findOne({
      _id: authorizedUser._id
    }).populate({
      path: "recentlyPlayed",
      options: { sort: { createdAt: -1 } }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User Not found please create account!"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User account and all associated data deleted successfully",
      recentPlayedSongs: user.recentlyPlayed,
    }, { status: 200 })
  } catch (error) {
    console.error("Error in DELETE endpoint:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }

    const { songId } = await req.json();
    const authorizedUser = session?.user;

    await User.findByIdAndUpdate(
      authorizedUser._id,
      { $push: { recentlyPlayed: songId } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Recently Played song added",
    }, { status: 200 })
  } catch (error) {
    console.error("Error in Recently played route:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}