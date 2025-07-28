
import axios from "axios";

const BASE_URL = "https://api.spoonacular.com/recipes";
const API_KEY = "0195d3f966fa4f80bd2c944e51aca050";

// Fetch recipes based on ingredients & filters
export const fetchRecipes = async (ingredients, filters) => {
    try {
        const response = await axios.get(`${BASE_URL}/findByIngredients`, {
            params: {
                ingredients: ingredients,
                number: 10,
                apiKey: API_KEY,
                ...filters
            }
        });

        const recipes = await Promise.all(
            response.data.map(async (recipe) => {
                const details = await axios.get(`${BASE_URL}/${recipe.id}/information`, {
                    params: { apiKey: API_KEY }
                });
                return details.data;
            })
        );

        return recipes;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
};