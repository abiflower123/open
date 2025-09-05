import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AIChef.css";

const AIChef = () => {
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

 // src/components/AIChef.jsx

// ... other code

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      // ✅ Corrected URL: The backend route is now '/api/gemini'
      "http://localhost:5000/api/gemini",
      // ✅ Corrected the request body key from 'ingredients' to 'prompt'
      { prompt: input },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    );
    // ✅ Corrected the response key from 'recipe' to 'suggestion'
    setRecipe(res.data.suggestion || "No recipe generated");
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    setRecipe(`Error: ${err.response?.data?.msg || err.message}`);
  } finally {
    setLoading(false);
  }
};
 return (
    <div className="ai-chef-container">
      <h2>AI Chef</h2>
      <p>Ask for recipes like: "Quick pasta with shrimp"</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What recipe do you want?"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Ask AI Chef"}
        </button>
      </form>

      {recipe.startsWith("Error:") ? (
  <div className="error-message">{recipe}</div>
) : (
  <div className="recipe-result">
    <h3>✨ Your Recipe:</h3>
    <pre>{recipe}</pre>
  </div>
)}
    
    </div>
  );
};

export default AIChef;