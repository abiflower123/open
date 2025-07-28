import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style.css'; // For general styling

const SearchHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Function to fetch search history
    const fetchSearchHistory = async () => {
        if (!token) {
            alert('Please log in to view your search history.');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get('http://localhost:5000/api/search-history', config);
            setHistory(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching search history:', err);
            setError('Failed to fetch search history.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchSearchHistory();
    }, [token, navigate]);

    // --- ENHANCED: Function to re-run a historical search ---
    const handleReRunSearch = (ingredients, filters) => {
        navigate('/', {
            state: {
                ingredients: ingredients,
                filters: filters // Pass the entire filters object
            }
        });
    };

    // Function to delete a search history entry (remains the same)
    const handleDeleteSearch = async (id) => {
        if (!token) return;

        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await axios.delete(`http://localhost:5000/api/search-history/${id}`, config);
            alert('Search entry deleted!');
            // Refresh the history list
            fetchSearchHistory();
        } catch (err) {
            console.error('Error deleting search history entry:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                alert(`Error: ${err.response.data.msg}`);
            } else {
                alert('Failed to delete search entry.');
            }
        }
    };

    if (loading) return <p className="loading">Loading search history...</p>;
    if (error) return <p className="error">{error}</p>;
    if (history.length === 0) return <p className="no">You have no search history yet. Start searching for recipes!</p>;

    return (
        <div className="search-history-container">
            <h2 className="delicious-recipes">My Search History</h2>
            <div className="history-list">
                {history.map((entry) => (
                    <div key={entry._id} className="history-item">
                        <p><strong>Ingredients:</strong> {entry.ingredients}</p>
                        {entry.filters.cuisine && <p><strong>Cuisine:</strong> {entry.filters.cuisine}</p>}
                        {entry.filters.maxReadyTime && <p><strong>Max Time:</strong> {entry.filters.maxReadyTime} mins</p>}
                        <p className="search-date">Searched on: {new Date(entry.createdAt).toLocaleString()}</p>
                        <div className="history-actions">
                            <button
                                onClick={() => handleReRunSearch(entry.ingredients, entry.filters)}
                                className="history-action-button re-run"
                            >
                                Re-run Search
                            </button>
                            <button
                                onClick={() => handleDeleteSearch(entry._id)}
                                className="history-action-button delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchHistory;