const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  judul: { 
    type: String, 
    required: true 
  },
  youtube_url: { 
    type: String, 
    required: true,
    set: function(url) {
      try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
        return url;
      } catch (error) {
        return url;
      }
    },
    validate: {
      validator: function(url) {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === 'www.youtube.com' && 
                 urlObj.pathname === '/watch' && 
                 urlObj.searchParams.has('v');
        } catch (error) {
          return false;
        }
      },
      message: 'Format URL YouTube tidak valid!'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;