// Footer.js

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'lightgrey', color: 'black', py: 3 }}>
      <Container maxWidth="lg" style={{ textAlign: 'center' }}>
        <Typography variant="body1">
          © 2024 ChatApp, Inc.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
