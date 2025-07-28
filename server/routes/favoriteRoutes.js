const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Import your authentication middleware
const FavoriteRecipe = require('../models/FavoriteRecipe'); // Import the FavoriteRecipe model

// @route   POST /api/favorites
// @desc    Save a recipe to user's favorites
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
    const { recipeId, title, image } = req.body; // Expect these from the frontend
    const userId = req.user.id; // Get user ID from the authenticated token

    try {
        // Check if the recipe is already favorited by this user
        let existingFavorite = await FavoriteRecipe.findOne({ userId, recipeId });
        if (existingFavorite) {
            return res.status(400).json({ msg: 'Recipe already in favorites' });
        }

        const newFavorite = new FavoriteRecipe({
            userId,
            recipeId,
            title,
            image
        });

        await newFavorite.save();
        res.json({ msg: 'Recipe added to favorites', favorite: newFavorite });
    } catch (err) {
        console.error(err.message);
        // Handle unique constraint error specifically if needed, though 400 above handles it
        if (err.code === 11000) { // MongoDB duplicate key error code
            return res.status(400).json({ msg: 'Recipe already in favorites' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/favorites
// @desc    Get all favorite recipes for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await FavoriteRecipe.find({ userId: req.user.id }).sort({ createdAt: -1 }); // Sort by most recent
        res.json(favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/favorites/:recipeId
// @desc    Remove a recipe from user's favorites
// @access  Private
router.delete('/:recipeId', auth, async (req, res) => {
    try {
        const favorite = await FavoriteRecipe.findOneAndDelete({
            userId: req.user.id,
            recipeId: req.params.recipeId
        });

        if (!favorite) {
            return res.status(404).json({ msg: 'Favorite recipe not found' });
        }

        res.json({ msg: 'Recipe removed from favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;