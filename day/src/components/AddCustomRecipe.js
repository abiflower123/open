import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams for edit mode
import '../style.css';

const AddCustomRecipe = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [readyInMinutes, setReadyInMinutes] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState(''); // Comma-separated string
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { id } = useParams(); // Get recipe ID from URL if in edit mode
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('Please log in to add/edit custom recipes.');
            navigate('/login');
            return;
        }

        // If 'id' is present in params, it means we are in edit mode
        if (id) {
            const fetchRecipe = async () => {
                setLoading(true);
                try {
                    const config = {
                        headers: { 'x-auth-token': token }
                    };
                    const res = await axios.get(`https://backend-recepie-generator.onrender.com
/api/custom-recipes/${id}`, config);
                    const recipe = res.data;

                    setTitle(recipe.title);
                    setImage(recipe.image || '');
                    setReadyInMinutes(recipe.readyInMinutes || '');
                    setServings(recipe.servings || '');
                    // Convert array of objects {original: "string"} to comma-separated string
                    setIngredients(recipe.extendedIngredients.map(ing => ing.original).join(', '));
                    setInstructions(recipe.instructions);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching recipe for edit:', err);
                    setError('Failed to load recipe for editing.');
                    setLoading(false);
                    if (err.response && err.response.status === 401) {
                        alert('Session expired or unauthorized. Please log in again.');
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else if (err.response && err.response.status === 404) {
                         setError('Recipe not found or you do not have permission to edit it.');
                    }
                }
            };
            fetchRecipe();
        }
    }, [id, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!token) {
            setError('You must be logged in to save recipes.');
            setLoading(false);
            return;
        }

        const ingredientsArray = ingredients.split(',').map(item => item.trim()).filter(item => item !== '');

        const recipeData = {
            title,
            image,
            readyInMinutes: readyInMinutes ? Number(readyInMinutes) : null,
            servings: servings ? Number(servings) : null,
            extendedIngredients: ingredientsArray,
            instructions,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            if (id) {
                // Update existing recipe
                await axios.put(`https://backend-recepie-generator.onrender.com
/api/custom-recipes/${id}`, recipeData, config);
                setSuccess('Recipe updated successfully!');
            } else {
                // Add new recipe
                await axios.post('https://backend-recepie-generator.onrender.com
/api/custom-recipes', recipeData, config);
                setSuccess('Recipe added successfully!');
                // Clear form after successful addition
                setTitle('');
                setImage('');
                setReadyInMinutes('');
                setServings('');
                setIngredients('');
                setInstructions('');
            }
            setLoading(false);
            setTimeout(() => navigate('/my-recipes'), 1500); // Redirect after a short delay
        } catch (err) {
            console.error('Error saving recipe:', err);
            setLoading(false);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(`Error: ${err.response.data.msg}`);
            } else if (err.response && err.response.status === 401) {
                setError('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError('Failed to save recipe. Please try again.');
            }
        }
    };

    return (
        <div className="custom-recipe-form-container">
            <h2 className="delicious-recipes">{id ? 'Edit Custom Recipe' : 'Add New Custom Recipe'}</h2>
            <form onSubmit={handleSubmit} className="custom-recipe-form">
                <div className="form-group">
                    <label htmlFor="title">Recipe Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Grandma's Apple Pie"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image URL (Optional):</label>
                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="e.g., https://example.com/apple-pie.jpg"
                    />
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label htmlFor="readyInMinutes">Cooking Time (minutes):</label>
                        <input
                            type="number"
                            id="readyInMinutes"
                            value={readyInMinutes}
                            onChange={(e) => setReadyInMinutes(e.target.value)}
                            placeholder="e.g., 45"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="servings">Servings:</label>
                        <input
                            type="number"
                            id="servings"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            placeholder="e.g., 8"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients (comma-separated):</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., 1 cup flour, 2 large eggs, 1 tsp baking powder"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Step 1: Mix dry ingredients. Step 2: Add wet ingredients..."
                        rows="8"
                        required
                    ></textarea>
                </div>

                <button type="submit" className="submit-recipe-button" disabled={loading}>
                    {loading ? (id ? 'Updating...' : 'Adding...') : (id ? 'Update Recipe' : 'Add Recipe')}
                </button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default AddCustomRecipe;
