const Video = require('../models/Video');
const db = require('../config/database');

// Get semua video dengan pagination dan search
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Buat query pencarian
    const query = search 
      ? { judul: { $regex: search, $options: 'i' } }
      : {};
    
    // Hitung total dokumen untuk pagination
    const total = await Video.countDocuments(query);
    
    // Hitung total pages
    const totalPages = Math.ceil(total / limit);
    
    // Get videos dengan pagination
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: videos,
      page,
      totalPages,
      total,
      limit
    });
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create video baru
exports.createVideo = async (req, res) => {
  try {
    const { judul, youtube_url } = req.body;
    
    // Validasi URL YouTube
    try {
      const urlObj = new URL(youtube_url);
      if (!urlObj.hostname.includes('youtube.com') || !urlObj.searchParams.has('v')) {
        return res.status(400).json({ 
          message: 'URL YouTube tidak valid! Gunakan format: https://www.youtube.com/watch?v=...' 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        message: 'URL tidak valid!' 
      });
    }

    const video = new Video({
      judul,
      youtube_url
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error in createVideo:', error);
    res.status(400).json({ 
      message: error.message || 'Terjadi kesalahan saat menyimpan video' 
    });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video tidak ditemukan' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error in getVideoById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { judul, youtube_url } = req.body;
    
    // Validasi URL YouTube
    if (youtube_url) {
      try {
        const urlObj = new URL(youtube_url);
        if (!urlObj.hostname.includes('youtube.com') || !urlObj.searchParams.has('v')) {
          return res.status(400).json({ 
            message: 'URL YouTube tidak valid! Gunakan format: https://www.youtube.com/watch?v=...' 
          });
        }
      } catch (error) {
        return res.status(400).json({ 
          message: 'URL tidak valid!' 
        });
      }
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { judul, youtube_url },
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ message: 'Video tidak ditemukan' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error in updateVideo:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video tidak ditemukan' });
    }
    res.json({ message: 'Video berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({ message: error.message });
  }
};