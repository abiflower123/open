// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const searchHistoryRoutes = require('./routes/searchHistoryRoutes');
const customRecipeRoutes = require('./routes/customRecipeRoutes');
const geminiRoutes = require("./routes/geminiRoutes");

 // NEW: Import this



const app = express();
const PORT = process.env.PORT || 5000;
// Add to your existing server.js
// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true
  }));
  

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/custom-recipes', customRecipeRoutes);
app.use("/api/gemini", geminiRoutes);


// NEW: Use the AI suggestion route

// Simple test route
app.get('/', (req, res) => {
    res.send('Recipe Generator Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});