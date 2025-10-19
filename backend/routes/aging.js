const express = require('express');
const router = express.Router();
const agingController = require('../controllers/agingController');

// POST /api/face/aging
router.post('/', agingController.generateAging);

module.exports = router;

