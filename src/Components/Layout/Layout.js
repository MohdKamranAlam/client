// Layout.js
import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import { Box, Container } from '@mui/material';

const Layout = ({ children, isLoggedIn, handleLogout, username }) => {
return (
<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
<Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} />

  <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 3, mb: 3 }}>
    <Box component="main" sx={{ overflow: 'auto' }}>
      {children} {/* Content rendered here */}
    </Box>
  </Container>

  <Footer />
</Box>
);
};

export default Layout;