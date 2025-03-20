const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController') ;// Sesuaikan dengan nama file yang benar

router.get('/test', (req, res) => {
    res.json({ message: 'Video route is working' });
  });

// Routes
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', videoController.createVideo);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;