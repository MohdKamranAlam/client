import React, { useState, useEffect, useRef, memo } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Button, Card, CardContent, TextField, IconButton, Box, Typography, Grid, CardActions } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendIcon from '@mui/icons-material/Send';
import Message from './Message'; // Make sure Message component is compatible with Material UI if you're using it
import ChatBox2 from './ChatBox2/ChatBox2';
import './chatbox.css'; // Ensure this file only contains necessary overrides

// Connect to the socket server
const socket = io.connect('http://localhost:8084'); // Adjust the URL/port as necessary

const ChatBox = memo(({ userId }) => {
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const endOfMessagesRef = useRef(null);

  // Helper function to determine if a message is a coding question
  const isCodingQuestion = (message) => {
    const codingKeywords = ["python", "java", "nodejs", "javascript", "code", "coding"]; // Add more as needed
    return codingKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  // Function to send a message
  const sendMessage = () => {
    if (message.trim()) {
      const isCode = isCodingQuestion(message);
      socket.emit('message', { userId, userMessage: message, sessionId, isCode });
      setMessages(prevMessages => [...prevMessages, { content: message, sender: 'user', isCode }]);
      setMessage('');
    }
  };

  // Function to start a new session
  const startNewSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
  };

  // Effect for setting up the socket connection
  useEffect(() => {
    setSessionId(uuidv4());
    let ongoingResponse = { content: '', isCode: false };
  
    const responseHandler = (response) => {
      if (typeof response.content === 'string') {
        ongoingResponse.content += response.content; // Append new chunk to ongoing response content
        ongoingResponse.isCode = response.isCode; // Update isCode flag if necessary
  
        if (response.final) {
          // If this is the final chunk, add the complete response to messages and reset ongoingResponse
          setMessages(prevMessages => [...prevMessages, {
            ...ongoingResponse,
            sender: 'ai'
          }]);
          ongoingResponse = { content: '', isCode: false }; // Reset for the next message
        }
      } else {
        console.error('Response content is not a string', response.content);
      }
    };
  
    socket.on('response', responseHandler);
  
    return () => {
      socket.off('response', responseHandler);
    };
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={8}> {/* Adjusted to take more space on medium devices */}
          <Card raised sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}> {/* Increased height */}

            {/* Heading and Start New Session Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
              <Typography variant="h5">Live Chat...</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RestartAltIcon />}
                onClick={startNewSession}
                sx={{
                  borderRadius: 20,
                  boxShadow: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  background: 'linear-gradient(to right, #6e8efb, #88a2f9)',
                }}
              >
                Start New Session
              </Button>
            </Box>

            {/* Scrollable Message Area */}
            <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Adjusted for dynamic height */}
              {messages.map((msg, index) => (
                <Message key={index} content={msg.content} sender={msg.sender} isCode={msg.isCode} />
              ))}
              <div ref={endOfMessagesRef} />
            </CardContent>

            {/* Input Field and Send Button */}
            <CardActions sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
              <TextField
                fullWidth
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                sx={{ flexGrow: 1, marginRight: '10px' }}
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
              />
              <IconButton color="primary" onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </CardActions>

          </Card>
        </Grid>
        <Grid item xs={12} md={4}> {/* Adjusted to balance the layout */}
          <ChatBox2 userId={userId} sessionId={sessionId} />
        </Grid>
      </Grid>
    </Box>

  );
});

export default ChatBox;
