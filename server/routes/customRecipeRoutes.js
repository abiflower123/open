const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const CustomRecipe = require('../models/CustomRecipe');

// Helper to check if a string is a valid URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (e) {
        return false;
    }
};

// @route   POST /api/custom-recipes
// @desc    Add a new custom recipe
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, image, readyInMinutes, servings, extendedIngredients, instructions } = req.body;
    const userId = req.user.id;

    // Basic validation
    if (!title || !extendedIngredients || extendedIngredients.length === 0 || !instructions) {
        return res.status(400).json({ msg: 'Please enter all required fields: title, ingredients, and instructions.' });
    }

    // Validate image URL if provided, otherwise use default
    let imageUrl = image;
    if (imageUrl && !isValidUrl(imageUrl)) {
        imageUrl = 'https://spoonacular.com/recipeImages/10000-300x200.jpg'; // Use default if invalid URL
    } else if (!imageUrl) {
        imageUrl = 'https://spoonacular.com/recipeImages/10000-300x200.jpg'; // Default if no image provided
    }

    try {
        const newCustomRecipe = new CustomRecipe({
            userId,
            title,
            image: imageUrl,
            readyInMinutes: readyInMinutes || null,
            servings: servings || null,
            // Ensure ingredients are stored as objects { original: "string" }
            extendedIngredients: extendedIngredients.map(ing => ({ original: ing.trim() })),
            instructions,
        });

        const recipe = await newCustomRecipe.save();
        res.status(201).json({ msg: 'Recipe added successfully!', recipe });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/custom-recipes
// @desc    Get all custom recipes for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const customRecipes = await CustomRecipe.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(customRecipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/custom-recipes/:id
// @desc    Get a single custom recipe by ID (for editing)
// @access  Private (user must own the recipe)
router.get('/:id', auth, async (req, res) => {
    try {
        const recipe = await CustomRecipe.findOne({ _id: req.params.id, userId: req.user.id });
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found or not authorized' });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/custom-recipes/:id
// @desc    Update a custom recipe
// @access  Private (user must own the recipe)
router.put('/:id', auth, async (req, res) => {
    const { title, image, readyInMinutes, servings, extendedIngredients, instructions } = req.body;
    const recipeId = req.params.id;
    const userId = req.user.id;

    // Basic validation
    if (!title || !extendedIngredients || extendedIngredients.length === 0 || !instructions) {
        return res.status(400).json({ msg: 'Please enter all required fields: title, ingredients, and instructions.' });
    }

    // Validate image URL if provided, otherwise use default
    let imageUrl = image;
    if (imageUrl && !isValidUrl(imageUrl)) {
        imageUrl = 'https://spoonacular.com/recipeImages/10000-300x200.jpg'; // Use default if invalid URL
    } else if (!imageUrl) {
        imageUrl = 'https://spoonacular.com/recipeImages/10000-300x200.jpg'; // Default if no image provided
    }

    const recipeFields = {
        title,
        image: imageUrl,
        readyInMinutes: readyInMinutes || null,
        servings: servings || null,
        extendedIngredients: extendedIngredients.map(ing => ({ original: ing.trim() })),
        instructions,
    };

    try {
        let recipe = await CustomRecipe.findOne({ _id: recipeId, userId });

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found or not authorized' });
        }

        recipe = await CustomRecipe.findByIdAndUpdate(
            recipeId,
            { $set: recipeFields },
            { new: true } // Return the updated document
        );

        res.json({ msg: 'Recipe updated successfully!', recipe });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/custom-recipes/:id
// @desc    Delete a custom recipe
// @access  Private (user must own the recipe)
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await CustomRecipe.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found or not authorized' });
        }

        res.json({ msg: 'Recipe removed successfully!' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;