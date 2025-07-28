const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Import your authentication middleware
const SearchHistory = require('../models/SearchHistory'); // Import the SearchHistory model

// @route   POST /api/search-history
// @desc    Record a user's search query
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
    const { ingredients, filters } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated token

    try {
        const newSearch = new SearchHistory({
            userId,
            ingredients,
            filters: {
                cuisine: filters.cuisine || '',
                maxReadyTime: filters.maxReadyTime || null
            }
        });

        await newSearch.save();
        res.json({ msg: 'Search recorded successfully', search: newSearch });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/search-history
// @desc    Get all search history for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Fetch search history, sorted by most recent first
        const history = await SearchHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/search-history/:id
// @desc    Delete a specific search history entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const searchEntry = await SearchHistory.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!searchEntry) {
            return res.status(404).json({ msg: 'Search history entry not found' });
        }

        res.json({ msg: 'Search history entry removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;