const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

// Update schema gambar untuk Cloudinary
const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,    // Tambahan field untuk Cloudinary
  size: Number
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: imageSchema,
  options: [optionSchema],
  type: { 
    type: String, 
    required: true,
    enum: ['boolean', 'multiple']
  }
});

// Validasi ukuran gambar tetap sama
questionSchema.pre('save', function(next) {
  if (this.image && this.image.size && this.image.size > 2 * 1024 * 1024) {
    next(new Error('Image size cannot exceed 2MB'));
  }
  next();
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);