import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeDetails from './RecipeDetails'; // Reuse RecipeDetails for display
import '../style.css'; // For general styling

const FavoriteRecipes = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('Please log in to view your favorite recipes.');
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };
                const res = await axios.get('http://localhost:5000/api/favorites', config);
                // The backend only stores basic info (id, title, image) for favorites.
                // To display full details, we would ideally refetch from Spoonacular for each favorite.
                // For this example, we'll use the basic info stored in the FavoriteRecipe model
                // and pass it to RecipeDetails, which can then fetch full info if needed (already done by RecipeDetails).
                setFavoriteRecipes(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching favorite recipes:', err);
                setError('Failed to fetch favorite recipes.');
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchFavorites();
    }, [token, navigate]); // Re-run if token or navigate changes

    if (loading) return <p className="loading">Loading favorite recipes...</p>;
    if (error) return <p className="error">{error}</p>;
    if (favoriteRecipes.length === 0) return <p className="no">You have no favorite recipes saved yet.</p>;

    return (
        <div className="favorite-recipes-container">
            <h2 className="delicious-recipes">My Favorite Recipes</h2>
            <div className="recipes">
                {favoriteRecipes.map((favorite) => (
                    // When rendering from favorites, we only have basic info.
                    // RecipeDetails expects full recipe object. We can pass the basic info
                    // and RecipeDetails will handle fetching the full details if 'instructions' etc. are missing.
                    // Ensure your Spoonacular API key is active for this.
                    <RecipeDetails key={favorite.recipeId} recipe={{
                        id: parseInt(favorite.recipeId), // Convert back to number if Spoonacular expects it
                        title: favorite.title,
                        image: favorite.image,
                        // Add other properties that RecipeDetails expects, even if empty, to prevent errors
                        readyInMinutes: 'N/A', // Placeholder
                        extendedIngredients: [], // Placeholder
                        instructions: null // Will trigger VoiceAssistant to say "No instructions available"
                    }} />
                ))}
            </div>
        </div>
    );
};

export default FavoriteRecipes;