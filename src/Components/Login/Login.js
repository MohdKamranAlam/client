// Login.js component

import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwtDecode
import './login.css'; // Ensure the filename matches the case sensitivity of your file system

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [serverError, setServerError] = useState(''); // State to hold server-side errors

    const validateForm = () => {
        let errors = {};
        if (!username) errors.username = 'Username is required';
        if (!password) errors.password = 'Password is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Form is valid if there are no errors
    };

    const handleLogin = async () => {
        if (!validateForm()) return; // Stop the login process if the form is invalid

        try {
            const response = await axios.post('http://localhost:8084/auth/login', { username, password });
            const { token } = response.data;

            localStorage.setItem('userToken', token); // Store the token in localStorage
            const decoded = jwtDecode(token); // Decode token to get user data
            console.log('Login successful for user:', decoded.username); // Optional: remove in production

            onLoginSuccess(token); // Trigger any post-login actions
        } catch (error) {
            if (error.response) {
                // Capture specific error messages from the server and display them
                setServerError(error.response.data.message);
            } else {
                console.error('Login failed:', error.message);
                setServerError('An error occurred during the login process.');
            }
        }
    };

    return (
        <div className="login-container">
            <input
                className="login-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {validationErrors.username && <div className="error">{validationErrors.username}</div>}

            <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {validationErrors.password && <div className="error">{validationErrors.password}</div>}

            <button className="login-button" onClick={handleLogin}>Login</button>

            {serverError && <div className="server-error">{serverError}</div>} {/* Display server-side errors */}
        </div>
    );
};

export default Login;
