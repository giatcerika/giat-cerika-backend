const Materi = require('../models/Materi');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.getAllMateri = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { judul: { $regex: search, $options: 'i' } },
          { konten: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const materi = await Materi.find(query).sort({ createdAt: -1 });
    res.json(materi);
  } catch (error) {
    console.error('Error in getAllMateri:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMateriById = async (req, res) => {
  try {
    const materi = await Materi.findById(req.params.id);
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }
    res.json(materi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMateri = async (req, res) => {
  try {
    const { judul, konten } = req.body;
    let thumbnailData = null;

    if (req.file) {
      thumbnailData = await uploadToCloudinary(req.file);
    }

    const materi = new Materi({
      judul,
      konten,
      thumbnail: thumbnailData ? thumbnailData.url : null,
      thumbnail_public_id: thumbnailData ? thumbnailData.public_id : null
    });

    const savedMateri = await materi.save();
    res.status(201).json(savedMateri);
  } catch (error) {
    console.error('Error in createMateri:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateMateri = async (req, res) => {
  try {
    const { judul, konten } = req.body;
    const oldMateri = await Materi.findById(req.params.id);
    
    if (!oldMateri) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    const updateData = {
      judul,
      konten
    };

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (oldMateri.thumbnail_public_id) {
        await deleteFromCloudinary(oldMateri.thumbnail_public_id);
      }
      
      // Upload new image
      const thumbnailData = await uploadToCloudinary(req.file);
      updateData.thumbnail = thumbnailData.url;
      updateData.thumbnail_public_id = thumbnailData.public_id;
    }

    const materi = await Materi.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(materi);
  } catch (error) {
    console.error('Error in updateMateri:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMateri = async (req, res) => {
  try {
    const materi = await Materi.findById(req.params.id);
    
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    // Delete image from Cloudinary if exists
    if (materi.thumbnail_public_id) {
      await deleteFromCloudinary(materi.thumbnail_public_id);
    }

    await Materi.findByIdAndDelete(req.params.id);
    res.json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteMateri:', error);
    res.status(500).json({ message: error.message });
  }
};