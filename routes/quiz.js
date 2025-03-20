// routes/quiz.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const quizController = require('../controllers/quizController');

// Buat array field dinamis untuk upload
function createUploadFields(maxQuestions) {
  const fields = [];
  for (let i = 0; i < maxQuestions; i++) {
    fields.push({ name: `image_${i}`, maxCount: 1 });
  }
  return fields;
}

// Routes untuk admin web (tanpa auth)
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);

// Gunakan createUploadFields untuk menghasilkan array field dinamis (50 pertanyaan)
router.post('/', upload.fields(createUploadFields(50)), quizController.createQuiz);
router.put('/:id', upload.fields(createUploadFields(50)), quizController.updateQuiz);

router.delete('/:id', quizController.deleteQuiz);

module.exports = router;