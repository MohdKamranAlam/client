import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwtDecode
import './Signup.css';

const Signup = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailId, setEmailId] = useState('');
    const [errors, setErrors] = useState({}); // State to hold validation errors

    // Validate input fields
    const validate = () => {
        let tempErrors = {};
        tempErrors.username = username ? "" : "Username is required.";
        tempErrors.emailId = emailId ? (/\S+@\S+\.\S+/.test(emailId) ? "" : "Email is not valid.") : "Email is required.";
        tempErrors.password = password.length >= 6 ? "" : "Password must be at least 6 characters long.";
        setErrors(tempErrors);
        // Form is valid if tempErrors object has no error messages
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSignup = async () => {
        if (!validate()) return; // Prevent the form submission if validation fails

        try {
            const response = await axios.post('http://localhost:8084/auth/signup', { username, password, emailId });
            const { token } = response.data;

            // Store the token in localStorage
            localStorage.setItem('userToken', token);

            // Decode token to get user data (assuming jwtDecode is correctly imported)
            const decoded = jwtDecode(token);
            console.log("Signup userId: ", decoded.userId);

            // Callback function to handle post-signup actions
            onSignupSuccess(token);
        } catch (error) {
            // Handle errors returned from the server
            if (error.response && error.response.data.message) {
                // Map server error to the appropriate field in the form
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...error.response.data.message.includes('Username') ? { username: error.response.data.message } : {},
                    ...error.response.data.message.includes('Email') ? { emailId: error.response.data.message } : {}
                }));
            } else {
                console.log('Error during signup:', error.message || 'An error occurred');
            }
        }
    };

    return (
        <div className="signup-container">
            <input
                className="signup-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {/* {errors.username && <div className="error-message">{errors.username}</div>} */}
            <input
                className="signup-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
            <input
                className="signup-input"
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Email"
            />
            {errors.emailId && <div className="error-message">{errors.emailId}</div>}
            <button className="signup-button" onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;
