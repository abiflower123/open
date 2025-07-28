import React from "react";
import RecipeDetails from "./RecipeDetails";

const RecipeList = ({ recipes }) => {
    return (
        <div>
             <h2 className="delicious-recipes"> Delicious Recipes</h2>
            <div class="recipes">
                           
        {recipes.length === 0 ? <p className="no">No recipes found.</p> : null}
            {recipes.map((recipe) => (
                <RecipeDetails key={recipe.id} recipe={recipe} />
            ))}
            </div>
        </div>
    );
};

export default RecipeList;
