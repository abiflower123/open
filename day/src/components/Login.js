import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://backend-recepie-generator.onrender.com
/api/auth/login', formData);
            setMessage('Login successful! Redirecting...');
            console.log(res.data); // Log the token
            // Store token in localStorage
            localStorage.setItem('token', res.data.token);
            setTimeout(() => {
                navigate('/'); // Redirect to home page (RecipeSearch) after login
            }, 1500);

        } catch (err) {
            console.error(err.response.data);
            setMessage(err.response.data.msg || 'Login failed.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            {message && <p className="auth-message">{message}</p>}
        </div>
    );
};

export default Login;
