const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const materiController = require('../controllers/materiController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Materi route is working' });
});

// Routes
router.get('/', materiController.getAllMateri);
router.get('/:id', materiController.getMateriById);
router.post('/', upload.single('thumbnail'), materiController.createMateri);
router.put('/:id', upload.single('thumbnail'), materiController.updateMateri);
router.delete('/:id', materiController.deleteMateri);

module.exports = router;