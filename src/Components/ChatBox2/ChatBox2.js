// ChatBox2.js Component

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@mui/material/IconButton';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';
import { Typography, Paper, Box, List, ListItem,Avatar,Card,ListItemAvatar, ListItemText, ListItemSecondaryAction, } from '@mui/material';
import './ChatBox2.css'


const ChatBox2 = ({ userId }) => {
  const [sessions, setSessions] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');


  const fetchSessions = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve the token from storage
      const response = await fetch(`http://localhost:8084/auth/chatlogs/sessions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header},
        }
      });
      if (!response.ok) {
        // If the response is not ok, do not attempt to parse it as JSON
        const errorText = await response.text(); // You could log this text for more details
        throw new Error(`Error response from server: ${errorText}`);
      }

      const sessionsData = await response.json(); // Now you can safely parse the response as JSON
      //console.log("sessions ids from fetch session:  ", sessionsData[0].firstMessage);
      console.log("Message:  ", sessionsData);
      //sessionsData.map((data) =>  console.log(`firstMessage: ${data.firstMessage} sessionId:  ${data.sessionId}`))

      // Set sessions with the sessionIds received from the server
      setSessions(sessionsData || []);

    } catch (error) {
      console.error('Error fetching sessions', error);
    }
  },[]);

  useEffect(() => {
    if (userId) {
      fetchSessions(userId);
    }
  }, [userId, fetchSessions]);

  const handleSelectSession = useCallback(async (sessionId) => {
    console.log("Selected sessionId: ", sessionId);
    setExpandedSessionId(sessionId);
    // If the chat history for the selected session isn't already loaded, fetch it
    if (!chatHistory[sessionId]) {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`http://localhost:8084/auth/chatlogs/sessions/${userId}/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching chat history');
        }

        const data = await response.json();
        console.log("getting userId and sessionId:  ", userId, sessionId, data)
        console.log(`getting userId: ${userId} sessionId: ${sessionId} messageTime: ${data.createdAt} responseTime: ${data.updatedAt}`)
        setChatHistory((prevHistory) =>
          ({ ...prevHistory, [sessionId]: data }));
      } catch (error) {
        console.error('Error fetching chat history:', sessionId, error);
        // Even in case of error, set an empty array to indicate that loading was attempted
        setChatHistory((prevHistory) => ({ ...prevHistory, [sessionId]: [] }));
      }
    } else {
      // If chat history is already loaded, just expand the session
      setExpandedSessionId(sessionId);
    }
  },[chatHistory])

  const formatTimestamp = useCallback((timestamp) => {
    // Check if timestamp is a BigQueryTimestamp object
    if (timestamp && timestamp.value) {
      // Convert BigQueryTimestamp to a standard JavaScript Date object
      timestamp = new Date(timestamp.value);
    } else if (typeof timestamp === 'string' && timestamp.trim() !== '') {
      // If timestamp is a string, attempt to create a Date object
      timestamp = new Date(timestamp);
    }
  
    // Check if the date is valid
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid Date';
    }
  
    // Return the date and time as a formatted string
    return timestamp.toLocaleString();
  },[])
  // // Function to format the timestamp
  // const formatTimestamp = (timestamp) => {
  //   // Check if timestamp is a valid string

    
  //   if (typeof timestamp !== 'string' || timestamp.trim() === '') {
  //     return 'No timestamp provided';
  //   }

  //   // Create a Date object using the ISO 8601 formatted string
  //   const date = new Date(timestamp);

  //   // Check if the date is valid
  //   if (isNaN(date)) {
  //     return 'Invalid Date';
  //   }

  //   // Return the date and time as a formatted string
  //   return date.toLocaleString();
  // };

  // const handleDeleteSession = async (sessionId, event) => {
  //   event.stopPropagation(); // Prevents the session from expanding when the delete button is clicked

  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:8084/auth/session/${sessionId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Error deleting session');
  //     }

  //     // Remove the deleted session from the local state
  //     setSessions(sessions.filter((session) => session.sessionId !== sessionId));
  //     console.log(`Session ${sessionId} deleted successfully`);
  //   } catch (error) {
  //     console.error('Error deleting session:', sessionId, error);
  //   }
  // };

  const handleDeleteSession = useCallback(async (sessionId, event) => {
    event.stopPropagation(); // Prevent expanding the session

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:8084/auth/session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSessions(sessions.filter((session) => session.sessionId !== sessionId));
        setDeleteErrorMessage(''); // Clear any previous error messages
      } else {
        const responseData = await response.json();
        if (response.status === 403 && responseData.message.includes("not old enough to be deleted")) {
          setDeleteErrorMessage(`Session ${sessionId} is not old enough to be deleted.`);
        } else {
          setDeleteErrorMessage('Please Delete this session after 90 minutes');
        }
      }
    } catch (error) {
      console.error('Error deleting session:', sessionId, error);
      setDeleteErrorMessage('Error deleting session. Please try again later.');
    }
  },[sessions])
  
  const getAvatar = (isUser) => (
    <Avatar>
      {isUser ? <PersonIcon /> : <ComputerIcon />}
    </Avatar>
  );

  return (
    <Paper className="card" elevation={3} sx={{ position: 'fixed', top: '64px', right: 0, bottom: '64px', width: '400px', display: 'flex', flexDirection: 'column' }}>
    <Box className="card-header" sx={{ padding: 2, backgroundColor: '#eceff1', borderBottom: '1px solid #dedede' }}>
      <Typography variant="h6" component="h5">
        Chat History
      </Typography>
    </Box>
    {deleteErrorMessage && (
        <Box textAlign="center" p={2} bgcolor="#FFDDDD">
          <Typography color="error" variant="body2">
            {deleteErrorMessage}
          </Typography>
        </Box>
      )}
    <List sx={{ maxHeight: 'calc(100% - 112px)', overflow: 'auto', padding: 0 }}>
      {expandedSessionId && chatHistory[expandedSessionId] ? (
        chatHistory[expandedSessionId].map((chatItem, index) => (
          <React.Fragment key={`chat-item-${index}`}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ mb: 2, maxWidth: 'calc(100% - 56px)' }}>
                <Paper elevation={1} sx={{ bgcolor: '#e8eaf6', p: 1, borderRadius: '10px', maxWidth: '80%' }}>
                  <Typography variant="body2">{chatItem.message}</Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {formatTimestamp(chatItem.createdAt)}
                </Typography>
              </Box>
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'row-reverse' }}>
              <ListItemAvatar>
                <Avatar>
                  <ComputerIcon />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ mb: 2, maxWidth: 'calc(100% - 56px)' }}>
                <Paper elevation={1} sx={{ bgcolor: '#c5cae9', p: 1, borderRadius: '10px', maxWidth: '80%' }}>
                  <Typography variant="body2">{chatItem.response}</Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {formatTimestamp(chatItem.updatedAt)}
                </Typography>
              </Box>
            </ListItem>
          </React.Fragment>
        ))
      ) : (
        <Typography variant="body2" sx={{ padding: 2 }}>
          No chat history available.
        </Typography>
      )}
    </List>
      <Box className="card-header" sx={{ padding: 3, backgroundColor: '#eceff1' }}>
        <Typography variant="h7" component="h6">
          Session History
        </Typography>
      </Box>
      <Box className="session-history" sx={{ overflow: 'auto' }}>
        {sessions.length > 0 ? (
          <List>
            {sessions.map((session, index) => (
              <ListItem
                key={`session-${index}`}
                button
                onClick={() => handleSelectSession(session.sessionId)}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}
              >
                <ListItemText
                  primary={session.firstMessage || 'No Message'}
                  secondary={formatTimestamp(session.createdAt)}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteSession(session.sessionId, e)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ padding: 2 }}>
            No session history available.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ChatBox2;

