// cleanup.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Materi = require('./models/Materi');
const Quiz = require('./models/Quiz');
require('dotenv').config();

async function cleanupUnusedImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get all materi documents
    const materis = await Materi.find({}, 'thumbnail');
    const materiThumbnails = materis.map(m => m.thumbnail).filter(Boolean);
    
    // Get all quiz documents and extract image URLs
    const quizzes = await Quiz.find();
    const quizImages = quizzes.reduce((acc, quiz) => {
      quiz.questions.forEach(question => {
        if (question.image && question.image.url) {
          acc.push(question.image.url);
        }
      });
      return acc;
    }, []);
    
    // Combine all used images
    const usedImages = [...materiThumbnails, ...quizImages];
    
    // Read uploads directory
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist');
      await mongoose.connection.close();
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    
    // Check each file
    let deletedCount = 0;
    files.forEach(file => {
      const filePath = `/uploads/${file}`;
      if (!usedImages.includes(filePath)) {
        try {
          fs.unlinkSync(path.join(uploadsDir, file));
          console.log(`Deleted unused file: ${file}`);
          deletedCount++;
        } catch (error) {
          console.error(`Error deleting file ${file}:`, error);
        }
      }
    });

    console.log(`
Cleanup Summary:
---------------
Total files checked: ${files.length}
Files in use: ${usedImages.length}
Files deleted: ${deletedCount}
    `);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

cleanupUnusedImages();