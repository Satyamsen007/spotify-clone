import { getServerSession } from "next-auth";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized - Please login"
      }, { status: 401 });
    }
    const { songId } = await params;

    const authorizedUser = session?.user;

    await User.findByIdAndUpdate(authorizedUser._id, {
      $pull: {
        recentlyPlayed: songId
      }
    });

    return NextResponse.json({
      success: true,
      message: "User Recently Played songs array updated successfully",
    }, { status: 200 })
  } catch (error) {
    console.error("Error in Remove song from users history endpoint:", error);
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