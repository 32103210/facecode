const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// POST /api/face/analyze
router.post('/', analysisController.analyzeFace);

module.exports = router;

