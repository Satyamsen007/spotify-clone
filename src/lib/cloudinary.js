import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    // Convert buffer to readable stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null); // Signals end of stream
    bufferStream.pipe(uploadStream);
  });
};

export const uploadImage = async (buffer) => {
  try {
    return await uploadFromBuffer(buffer, {
      folder: 'Spotify/images',
      resource_type: 'auto'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export const uploadAudio = async (buffer) => {
  try {
    return await uploadFromBuffer(buffer, {
      folder: 'Spotify/audios',
      resource_type: 'video' // Audio files use 'video' type in Cloudinary
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    throw error;
  }
};
