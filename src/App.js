// App.js component 

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import ChatBox from './Components/ChatBox';
import Login from './Components/Login/Login';
import Signup from './Components/SignUp/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Components/Layout/Layout';
import './Components/Layout/layout.css';

function App() {
    const [searchHistory, setSearchHistory] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ensuring consistency in localStorage key
        if (token) {
            try {
                const decoded = jwtDecode(token); // Corrected function call
                setLoggedInUserId(decoded.userId);
                setIsLoggedIn(true);
                setUsername(decoded.username); 
                fetchChatLogs(decoded.userId); // Fetch chat logs using the decoded userId
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('userToken'); // Corrected key
                setIsLoggedIn(false);
            }
        }
    }, []);

    const handleLoginSuccess = (token) => {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decoded.username);
        localStorage.setItem('userToken', token);
 
        setLoggedInUserId(decoded.userId);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setUsername('');
        setLoggedInUserId(null);
        setMessages([]); 
    };

    const fetchChatLogs = async (userId) => {
        
  
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`http://localhost:8084/auth/chatlogs/${userId}`, {
                method: 'get',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
            const logs = await response.json();
            console.log("logs: ", logs)
            setMessages(logs);
        } catch (error) {
            console.error('Error fetching chat logs:', error);
        }
    };

    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    const sendMessage = (newMessage) => {
        if (newMessage.trim() !== '') {
            const messageToSend = {
                content: newMessage,
                sender: 'user',
            };
            setMessages([...messages, messageToSend]);
        }
    };

    return (
            <Layout searchHistory={searchHistory} isLoggedIn={isLoggedIn} 
                    handleLogout={handleLogout} messages={messages} 
                    sendMessage={sendMessage}
                    username={username}
                    >
                <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <Signup onSignupSuccess={handleLoginSuccess} />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <ChatBox onNewSearch={setSearchHistory} userId={loggedInUserId} />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate replace to={isLoggedIn ? "/" : "/login"} />} />
                </Routes>
            </Layout>
    );
}

export default App;
