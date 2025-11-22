import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import RecipeDetails from './RecipeDetails'; // Reuse RecipeDetails for display
import '../style.css'; // For general styling

const MyCustomRecipes = () => {
    const [customRecipes, setCustomRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Function to fetch custom recipes
    const fetchCustomRecipes = async () => {
        if (!token) {
            alert('Please log in to view your custom recipes.');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { 'x-auth-token': token }
            };
            const res = await axios.get('https://backend-recepie-generator.onrender.com/api/custom-recipes', config);
            setCustomRecipes(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching custom recipes:', err);
            setError('Failed to fetch custom recipes.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchCustomRecipes();
    }, [token, navigate]);

    const handleDelete = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                const config = {
                    headers: { 'x-auth-token': token }
                };
                await axios.delete(`https://backend-recepie-generator.onrender.com/api/custom-recipes/${recipeId}`, config);
                alert('Recipe deleted successfully!');
                fetchCustomRecipes(); // Re-fetch recipes to update the list
            } catch (err) {
                console.error('Error deleting recipe:', err);
                if (err.response && err.response.data && err.response.data.msg) {
                    alert(`Error: ${err.response.data.msg}`);
                } else {
                    alert('Failed to delete recipe. Please try again.');
                }
            }
        }
    };

    if (loading) return <p className="loading">Loading your custom recipes...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="my-custom-recipes-container">
            <h2 className="delicious-recipes">My Custom Recipes</h2>
            <Link to="/my-recipes/add" className="add-recipe-button">Add New Recipe</Link>
            
            {customRecipes.length === 0 ? (
                <p className="no">You haven't added any custom recipes yet.</p>
            ) : (
                <div className="recipes">
                    {customRecipes.map((recipe) => (
                        <div key={recipe._id} className="custom-recipe-card-wrapper">
                            {/* Reuse RecipeDetails, mapping custom fields to Spoonacular-like fields */}
                            <RecipeDetails recipe={{
                                id: recipe._id, // Use MongoDB ID for key and potential future single-view
                                title: recipe.title,
                                image: recipe.image,
                                readyInMinutes: recipe.readyInMinutes,
                                servings: recipe.servings,
                                extendedIngredients: recipe.extendedIngredients,
                                instructions: recipe.instructions
                            }} />
                            <div className="custom-recipe-actions">
                                <Link to={`/my-recipes/edit/${recipe._id}`} className="edit-recipe-button">Edit</Link>
                                <button onClick={() => handleDelete(recipe._id)} className="delete-recipe-button">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCustomRecipes;
