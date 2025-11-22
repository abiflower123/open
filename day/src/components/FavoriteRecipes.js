import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Removing import of RecipeDetails, as we will use a dedicated card structure
// to avoid rendering the incorrect "Add to Favorites" button.
import '../style.css'; // For general styling

const API_BASE_URL = 'https://backend-e01b.onrender.com';

const FavoriteRecipes = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Function to handle removal of a favorite recipe
    const handleRemoveFavorite = async (recipeId) => {
        if (!token) {
            alert('You must be logged in to remove favorites.');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            // Call the DELETE endpoint for favorites
            await axios.delete(`${API_BASE_URL}/api/favorites/${recipeId}`, config);
            
            // Update the state to instantly remove the recipe from the list
            setFavoriteRecipes(prevFavorites => prevFavorites.filter(recipe => recipe.recipeId !== recipeId));
            
        } catch (err) {
            console.error('Error removing favorite recipe:', err);
            setError('Failed to remove favorite recipe. Please try again.');
            if (err.response && err.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        if (!token) {
            // Using a simple message instead of alert as alert is often discouraged
            // but keeping alert since the original code uses it.
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
                // Resolved merge conflict URL
                const res = await axios.get(`${API_BASE_URL}/api/favorites`, config);

                // Note: The structure of res.data items (favorite) is { recipeId, title, image }
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
    }, [token, navigate]);

    if (loading) return <p className="loading">Loading favorite recipes...</p>;
    if (error) return <p className="error">{error}</p>;
    if (favoriteRecipes.length === 0) return <p className="no">You have no favorite recipes saved yet.</p>;

    return (
        <div className="favorite-recipes-container">
            <h2 className="delicious-recipes">My Favorite Recipes</h2>
            <div className="recipes recipe-container">
                {favoriteRecipes.map((favorite) => (
                    <div className="recipe-card" key={favorite.recipeId}>
                        <img 
                            src={favorite.image} 
                            alt={favorite.title} 
                            // Add a placeholder/fallback image in case the URL is bad
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = `https://placehold.co/320x200/ff5722/ffffff?text=Image+Unavailable`; 
                            }}
                        />
                        <div className="recipe-details">
                            <h3>{favorite.title}</h3>
                            <p>Cooking Time: N/A</p>
                            <p>Ingredients: (Details not available in favorite summary)</p>
                            
                            {/* In a real app, this should link to the full details page, 
                                possibly using the recipe ID to fetch full details. */}
                            <a href={`/recipe/${favorite.recipeId}`} className="read-more">View Recipe</a>

                            {/* CRITICAL CHANGE: "Remove from Favorites" button */}
                            <button 
                                className="favorite-button" // Reusing the style, but functionality is removal
                                style={{ backgroundColor: '#f44336' }} // Making it red for deletion
                                onClick={() => handleRemoveFavorite(favorite.recipeId)}
                            >
                                Remove from Favorites
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteRecipes;
