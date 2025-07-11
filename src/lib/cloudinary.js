import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (buffer) => {
  try {
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'Spotify/images',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

const uploadAudio = async (buffer) => {
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

export { cloudinary, uploadImage, uploadAudio };