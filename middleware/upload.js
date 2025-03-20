// middleware/upload.js
const multer = require('multer');

// Konfigurasi multer untuk menyimpan file di memory
const storage = multer.memoryStorage();

// Filter file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;