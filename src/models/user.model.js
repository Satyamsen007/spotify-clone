import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  recentlyPlayed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ],
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist"
    }
  ]
}, { timestamps: true });



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


export const User = mongoose.models.User || mongoose.model('User', userSchema);