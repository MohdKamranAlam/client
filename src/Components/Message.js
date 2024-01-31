// Message.js component

import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import AndroidIcon from '@mui/icons-material/Android';
import { Box } from '@mui/material';
import './message.css'



const Message = ({ content, sender, isCode }) => {
  const isUser = sender === 'user';

  const renderContent = () => {
    // Check if the message contains bullet points, denoted by lines starting with a number or dash
    const bulletPointRegex = /^\d+\.\s|^-\s/gm;
    if (bulletPointRegex.test(content)) {
      // Split the content by new lines and filter out empty lines
      const lines = content.split('\n').filter(line => line.trim() !== '');
      // Map over the lines and wrap each one in a list item tag if it starts with a bullet point
      const listItems = lines.map((line, index) => {
        if (line.match(bulletPointRegex)) {
          return <li key={index}>{line.replace(bulletPointRegex, '')}</li>;
        }
        // If the line doesn't start with a bullet point, just return it as is
        return <React.Fragment key={index}>{line}<br /></React.Fragment>;
      });
      return <ul>{listItems}</ul>;
    } else if (isCode) {
      // Code content will be rendered within pre and code tags
      return <pre><code>{content}</code></pre>;
    } else {
      // Normal text content
      return <div className="message-text">{content}</div>;
    }
  };

  // return (
  //   <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
  //     {!isUser && <i className="fas fa-robot message-icon"></i>}
  //     <div className={`message-content ${isCode ? 'code-content' : ''}`}>
  //       {renderContent()}
  //     </div>
  //     {isUser && <i className="fas fa-user message-icon"></i>}
  //   </div>
  // );

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      mb: 2,
      mx: 2
    }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1,
          px: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'secondary.light' : 'primary.light',
          color: isUser ? 'secondary.contrastText' : 'primary.contrastText',
          marginLeft: isUser ? 'auto' : 0,
          marginRight: isUser ? 0 : 'auto',
          borderRadius: '20px',
          boxShadow: isUser ? 3 : 'none',
          border: isUser ? 'none' : 1,
          borderColor: 'primary.main',
        }}
      >
        {!isUser && <AndroidIcon color="primary" sx={{ mr: 1, verticalAlign: 'bottom' }} />}
        <Box sx={{ flexGrow: 2, overflowWrap: 'break-word', maxWidth: '100%' }}>
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', display: 'inline' }}>
            {renderContent()}
          </Typography>
        </Box>
        {isUser && <PersonIcon color="secondary" sx={{ ml: 1, verticalAlign: 'bottom' }} />}
      </Paper>
    </Box>
  );

};

export default Message;
