const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  answers: [{
    question: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    },
    selectedOption: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);