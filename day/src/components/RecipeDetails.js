import React, { useState, useEffect } from "react";
import VoiceAssistant from "./VoiceAssistant";
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // To redirect to login if not authenticated

const RecipeDetails = ({ recipe }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false); // New state for favorite status
    const token = localStorage.getItem('token'); // Get token from local storage
    const navigate = useNavigate();

    // Function to toggle instructions
    const handleViewRecipe = () => {
        setShowInstructions(!showInstructions);
    };

    // Check if recipe is already favorited by the user (optional, more advanced)
    // For simplicity, we'll just let them click to favorite/unfavorite
    // A more robust check would involve fetching favorite status on component mount.

    const handleFavorite = async () => {
        if (!token) {
            alert('Please log in to save favorite recipes.');
            navigate('/login'); // Redirect to login
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            // Data to send to backend (only relevant parts for favorite)
            const favoriteData = {
                recipeId: String(recipe.id), // Ensure it's a string, matching your schema
                title: recipe.title,
                image: recipe.image
            };

            // Assuming a save/toggle mechanism
            if (isFavorited) {
                // If already favorited, remove it
                await axios.delete(`https://backend-recepie-generator.onrender.com/api/favorites/${recipe.id}`, config);
                alert('Recipe removed from favorites!');
                setIsFavorited(false); // Update local state
            } else {
                // If not favorited, add it
                await axios.post('https://backend-recepie-generator.onrender.com/api/favorites', favoriteData, config);
                alert('Recipe added to favorites!');
                setIsFavorited(true); // Update local state
            }
            
        } catch (err) {
            console.error('Error saving/removing favorite:', err);
            // Handle error messages from backend
            if (err.response && err.response.data && err.response.data.msg) {
                alert(`Error: ${err.response.data.msg}`);
            } else if (err.response && err.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Failed to update favorite status. Please try again.');
            }
        }
    };
    
    // Optional: Fetch current favorite status when component mounts
    // This is more complex as it requires knowing if THIS specific recipe is favorited
    // and would involve another API call to /api/favorites/check/:recipeId (not implemented yet)
    // For now, setIsFavorited state is updated only on click.

    return (
        <div className="recipe-container">
            <div className="recipe-card">
                <img src={recipe.image} alt={recipe.title} width="200px" />
                <div className="recipe-details">
                    <h3>{recipe.title}</h3>
                    <p>Cooking Time: {recipe.readyInMinutes} mins</p>
                    <p>Ingredients:</p>
                    <ul>
                        {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient) => (
                            <li key={ingredient.id}>{ingredient.original}</li>
                        ))}
                    </ul>
                    <button onClick={handleViewRecipe} className="read-more">
                        {showInstructions ? "Hide Instructions" : "View Recipe"}
                    </button>
                    
                    {/* NEW: Favorite button, only visible if token exists */}
                    {token && (
                        <button onClick={handleFavorite} className="favorite-button">
                            {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    )}

                    {showInstructions && <ViewRecipe recipe={recipe} />}
                </div>
            </div>
        </div>
    );
};

const ViewRecipe = ({ recipe }) => {
    return (
        <div>
            <h4>Instructions:</h4>
            <p>{recipe.instructions ? recipe.instructions : "No instructions provided."}</p>
            <VoiceAssistant text={recipe.instructions || "No instructions available"} />
        </div>
    );
};

export default RecipeDetails;
