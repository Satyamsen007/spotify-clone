import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
}, { timestamps: true });


export const Playlist = mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);