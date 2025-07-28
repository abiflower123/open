const mongoose = require('mongoose');

const customRecipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: 'https://spoonacular.com/recipeImages/10000-300x200.jpg', // A default image if none provided
    },
    readyInMinutes: {
        type: Number,
        default: null,
    },
    servings: {
        type: Number,
        default: null,
    },
    // Store ingredients as an array of strings or objects, similar to Spoonacular's `original`
    extendedIngredients: [{
        original: String, // e.g., "1 cup flour", "2 eggs"
        // You could add 'id' or 'name' here if you want more structured ingredients
    }],
    instructions: {
        type: String,
        required: true,
    },
    // Any other fields you might want: cuisine, dish type, etc.
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('CustomRecipe', customRecipeSchema);