import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Smart Recipe Generator</Link>
            <div className="navbar-links">
                {token ? (
                    <>
                        <Link to="/favorites" className="nav-link">My Favorites</Link>
                        <Link to="/history" className="nav-link">Search History</Link>
                        <Link to="/my-recipes" className="nav-link">My Recipes</Link>
                        <Link to="/ai-suggest" className="nav-link">AI Suggestions</Link> {/* NEW */}
                        <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;