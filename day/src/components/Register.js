// src/components/Register.js (Hypothetical, as you haven't provided this file directly)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // To display success/error messages
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
            const res = await axios.post('https://backend-recepie-generator.onrender.com/api/auth/register', { username, password });
            localStorage.setItem('token', res.data.token);
            setMessage(res.data.msg || 'Registration successful!');
            navigate('/'); // Redirect to home or dashboard
        } catch (error) {
            // --- CRITICAL FIX HERE ---
            if (error.response) {
                // The server responded with a status code other than 2xx
                // Access error.response.data (if the server sends JSON errors)
                setMessage(error.response.data.msg || 'Registration failed from server. Please try again.');
                console.error('Registration error (server response):', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received (e.g., server not running)
                setMessage('No response from server. Please ensure the backend is running and reachable.');
                console.error('Registration error (no server response):', error.request);
            } else {
                // Something else happened in setting up the request that triggered an Error
                setMessage('An unexpected error occurred during registration. Please try again.');
                console.error('Registration error (Axios setup):', error.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
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
                <button type="submit">Register</button>
            </form>
            {message && <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>}
        </div>
    );
};

export default Register;
