const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { user, quiz: quizId, score, answers } = req.body;

    // Dapatkan data quiz untuk mendapatkan teks pertanyaan dan jawaban
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz tidak ditemukan' });
    }

    // Transformasi jawaban untuk menyimpan teks pertanyaan dan jawaban
    const formattedAnswers = answers.map(answer => {
      // Temukan pertanyaan berdasarkan ID
      const question = quiz.questions.find(q => q._id.toString() === answer.question);

      // Temukan opsi yang dipilih
      const selectedOption = question?.options.find(opt => opt._id.toString() === answer.selectedOption);

      return {
        question: {
          id: answer.question,
          text: question ? question.text : 'Pertanyaan tidak ditemukan'
        },
        selectedOption: {
          id: answer.selectedOption,
          text: selectedOption ? selectedOption.text : 'Opsi tidak ditemukan'
        },
        isCorrect: answer.isCorrect
      };
    });

    const quizAttempt = new QuizAttempt({
      user,
      quiz: quizId,
      score,
      answers: formattedAnswers
    });

    const savedAttempt = await quizAttempt.save();
    res.status(201).json(savedAttempt);
  } catch (error) {
    console.error('Error in submitQuizAttempt:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's quiz attempts
exports.getUserQuizAttempts = async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await QuizAttempt.find({ user: userId })
      .populate('quiz', 'title')
      .sort({ completedAt: -1 });
    res.json(attempts);
  } catch (error) {
    console.error('Error in getUserQuizAttempts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get specific quiz attempt
exports.getQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await QuizAttempt.findById(id)
      .populate('quiz')
      .populate('user', 'username');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error in getQuizAttempt:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get latest attempts
exports.getLatestAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting attempts for user:', userId);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get attempts without populate first
    const attempts = await QuizAttempt.find({ user: userId })
      .sort({ completedAt: -1 })
      .limit(3)
      .lean();

    console.log('Raw attempts found:', attempts.length);

    // Process attempts one by one with proper error handling
    const validAttempts = [];

    for (const attempt of attempts) {
      let attemptData = {
        score: attempt.score,
        date: attempt.completedAt,
        quizTitle: 'Quiz telah dihapus'
      };

      // Only try to get quiz title if we have a valid quiz ID
      if (attempt.quiz && mongoose.Types.ObjectId.isValid(attempt.quiz)) {
        try {
          const quiz = await Quiz.findById(attempt.quiz).select('title').lean();
          if (quiz && quiz.title) {
            attemptData.quizTitle = quiz.title;
          }
        } catch (err) {
          console.error('Error fetching quiz title:', err);
          // Keep default title on error
        }
      }

      validAttempts.push(attemptData);
    }

    console.log('Processed attempts:', validAttempts);

    res.json({
      success: true,
      attempts: validAttempts
    });
  } catch (error) {
    console.error('Error in getLatestAttempts:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack
    });
  }
};