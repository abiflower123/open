const express = require('express');
const router = express.Router();
const { getAISuggestion } = require('../controllers/geminiController');

// @route   POST /api/ai-suggest
// @desc    Get AI recipe suggestions from Hugging Face
// @access  Public (or add your auth middleware)
router.post('/', getAISuggestion);

module.exports = router;