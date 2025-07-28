const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    ingredients: {
        type: String,
        required: true,
        trim: true,
    },
    filters: {
        cuisine: {
            type: String,
            trim: true,
            default: ''
        },
        maxReadyTime: {
            type: Number,
            default: null // Can be null if no max time is set
        }
        // Add other filter types here as your project evolves
    },
}, {
    timestamps: true // Adds createdAt and updatedAt for tracking search time
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);