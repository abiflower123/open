import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeSearch from "./components/RecipeSearch";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import FavoriteRecipes from "./components/FavoriteRecipes";
import SearchHistory from "./components/SearchHistory";
import AddCustomRecipe from "./components/AddCustomRecipe"; // NEW: Import AddCustomRecipe
import MyCustomRecipes from "./components/MyCustomRecipes";
import AIChef from './components/AIChef';
import "./style.css";

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<RecipeSearch />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/favorites" element={<FavoriteRecipes />} />
                    <Route path="/history" element={<SearchHistory />} />
                    <Route path="/my-recipes" element={<MyCustomRecipes />} /> {/* NEW: Route for listing custom recipes */}
                    <Route path="/my-recipes/add" element={<AddCustomRecipe />} /> {/* NEW: Route for adding */}
                    <Route path="/my-recipes/edit/:id" element={<AddCustomRecipe />} />
                     {/* NEW: Route for editing */}
                     {/* This route is essential */}
                     <Route path="/ai-chef" element={<AIChef />} />

                               </Routes>
            </div>
        </Router>
    );
};

export default App;