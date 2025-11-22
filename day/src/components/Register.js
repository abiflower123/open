import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await axios.post('https://backend-e01b.onrender.com/api/auth/register', { username, password });
            localStorage.setItem('token', res.data.token);
            setMessage(res.data.msg || 'Registration successful!');
            navigate('/'); 
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.msg || 'Registration failed from server. Please try again.');
            } else if (error.request) {
                setMessage('No response from server. Please ensure the backend is running and reachable.');
            } else {
                setMessage('An unexpected error occurred during registration. Please try again.');
            }
        }
    };

    return (
        // The .auth-container (max-width: 400px) already controls the box width.
        <div className="auth-container">
            <h2>Register</h2>
            {/* 1. ADDED CLASS: 'auth-form' to enable input styling. */}
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* 2. ADDED CLASS: 'auth-button' to give the button full width and correct style. */}
                <button type="submit" className="auth-button">
                    Register
                </button>
            </form>
            {message && <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>}
        </div>
    );
};

export default Register;
