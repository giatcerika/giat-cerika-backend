const Materi = require('../models/Materi');
const Video = require('../models/Video');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const db = require('../config/database');


const getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    // Use Promise.all for parallel execution
    const [totalMateri, totalVideo, totalUser, totalQuiz, recentMateri, recentVideo, recentQuiz] = 
      await Promise.all([
        Materi.countDocuments(),
        Video.countDocuments(),
        User.countDocuments(),
        Quiz.countDocuments(),
        Materi.find().sort({ createdAt: -1 }).limit(5).select('judul createdAt'),
        Video.find().sort({ createdAt: -1 }).limit(5).select('judul createdAt'),
        Quiz.find().sort({ createdAt: -1 }).limit(5).select('title createdAt')
      ]);

    console.log('Stats fetched successfully');

    res.json({
      stats: {
        totalMateri,
        totalVideo,
        totalUser,
        totalQuiz
      },
      recent: {
        materi: recentMateri,
        video: recentVideo,
        quiz: recentQuiz
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ 
      message: 'Error getting dashboard stats', 
      error: error.message 
    });
  }
};
module.exports = {
  getDashboardStats
};