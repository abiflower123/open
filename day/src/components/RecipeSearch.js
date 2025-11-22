import React, { useState, useEffect } from "react";
import { fetchRecipes } from "../api";
import Filters from "./Filters";
import RecipeList from "./RecipeList";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Declare SpeechRecognition (or webkitSpeechRecognition for broader compatibility)
// Check if the browser supports it
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false; // Listen for a single utterance
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false; // Don't show interim results
}

const RecipeSearch = () => {
    const [ingredients, setIngredients] = useState("");
    const [filters, setFilters] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [listening, setListening] = useState(false); // NEW: State for voice search status
    const [voiceMessage, setVoiceMessage] = useState(''); // NEW: Message for voice search feedback

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.ingredients) {
            setIngredients(location.state.ingredients);
            setFilters(location.state.filters || {});
            const runSearchFromHistory = async () => {
                setLoading(true);
                setSearchError('');
                setRecipes([]);
                try {
                    const result = await fetchRecipes(location.state.ingredients, location.state.filters || {});
                    setRecipes(result);
                } catch (error) {
                    console.error("Error fetching recipes on re-run:", error);
                    setSearchError('Failed to re-run recipe search. Please try again.');
                    setRecipes([]);
                } finally {
                    setLoading(false);
                }
            };
            runSearchFromHistory();
        }
    }, [location.state]);

    // Function to handle the actual recipe search API call and history saving
    const performRecipeSearch = async (currentIngredients, currentFilters) => {
        setLoading(true);
        setSearchError('');
        setRecipes([]);

        try {
            const result = await fetchRecipes(currentIngredients, currentFilters);
            setRecipes(result);

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    };
                    await axios.post('https://backend-e01b.onrender.com/api/search-history', {
                        ingredients: currentIngredients,
                        filters: currentFilters
                    }, config);
                    console.log('Search history recorded.');
                } catch (historyErr) {
                    console.error('Failed to record search history:', historyErr);
                }
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setSearchError('Failed to fetch recipes. Please try again.');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Original handleSearch for manual search button click
    const handleSearch = () => {
        performRecipeSearch(ingredients, filters);
    };


    // --- NEW: Voice Search Logic ---
    useEffect(() => {
        if (!recognition) {
            setVoiceMessage('Voice search not supported by your browser. Please use Chrome for best results.');
            return;
        }

        recognition.onstart = () => {
            setListening(true);
            setVoiceMessage('Listening... Speak now.');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIngredients(transcript); // Set recognized text to ingredients input
            setVoiceMessage(`Recognized: "${transcript}"`);
            // Optionally, automatically trigger search after a short delay
            setTimeout(() => {
                performRecipeSearch(transcript, filters); // Use recognized text for search
            }, 500); // Give user a moment to see recognized text
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setListening(false);
            setVoiceMessage(`Error: ${event.error}. Try again.`);
            // Handle common errors
            if (event.error === 'not-allowed') {
                setVoiceMessage('Microphone access denied. Please enable it in browser settings.');
            } else if (event.error === 'no-speech') {
                setVoiceMessage('No speech detected. Please try again.');
            }
        };

        recognition.onend = () => {
            setListening(false);
            // Clear message after a short while if no error
            if (!searchError) {
                setTimeout(() => setVoiceMessage(''), 2000);
            }
        };

        // Clean up event listeners on component unmount
        return () => {
            if (recognition) {
                recognition.onstart = null;
                recognition.onresult = null;
                recognition.onerror = null;
                recognition.onend = null;
            }
        };
    }, [filters, searchError]); // Re-attach listeners if filters change, or if searchError resets

    const startVoiceSearch = () => {
        if (listening) {
            recognition.stop();
            setListening(false);
            setVoiceMessage('Voice search stopped.');
        } else if (recognition) {
            try {
                setVoiceMessage(''); // Clear previous messages
                recognition.start();
            } catch (e) {
                console.error("Recognition start error:", e);
                setVoiceMessage('Could not start voice search. Is microphone already in use?');
            }
        } else {
            setVoiceMessage('Voice search not supported by your browser.');
        }
    };

    return (
        <div>
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter ingredients (comma separated)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <button onClick={handleSearch} id="s">Search Recipes</button>

                {/* NEW: Voice Search Button */}
                <button onClick={startVoiceSearch} className="voice-search-button">
                    {listening ? 'Stop Listening' : 'Voice Search'}
                    <span className="mic-icon">{listening ? '🔴' : '🎤'}</span>
                </button>
            </div>

            {/* NEW: Display voice message */}
            {voiceMessage && <p className="voice-message">{voiceMessage}</p>}

            <Filters setFilters={setFilters} initialFilters={filters} />

            {loading && <p className="loading">Searching for recipes...</p>}
            {searchError && <p className="error">{searchError}</p>}

            <RecipeList recipes={recipes} />
        </div>
    );
};

export default RecipeSearch;
