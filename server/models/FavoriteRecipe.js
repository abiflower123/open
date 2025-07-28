const mongoose = require('mongoose');

const favoriteRecipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: String, // Spoonacular recipe ID is a string (or number, depending on API response)
        required: true,
    },
    // Optionally, store some basic recipe info to display without another API call
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    // You can add more fields if you want to store full recipe details directly
}, {
    timestamps: true,
    // Ensure that a user can only favorite a specific recipe once
    uniqueKeys: [['userId', 'recipeId']] // This is conceptually what we want, but Mongoose doesn't have a direct 'uniqueKeys' compound index option. We'll achieve this with `index` and error handling.
});

// Add a compound unique index to prevent duplicate favorites for the same user
favoriteRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteRecipe', favoriteRecipeSchema);