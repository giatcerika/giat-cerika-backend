const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file, folder = 'giat-cerika') => {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file');
    }

    // Gunakan direktori temporary sistem operasi
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}-${file.originalname}`);
    fs.writeFileSync(tempFilePath, file.buffer);

    // Upload file dari path
    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      folder: folder,
      resource_type: 'auto'
    });

    // Hapus file sementara
    fs.unlinkSync(tempFilePath);

    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      size: uploadResponse.bytes
    };
  } catch (error) {
    console.error('Detailed Cloudinary Upload Error:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};