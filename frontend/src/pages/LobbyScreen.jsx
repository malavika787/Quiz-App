//Lobby screen
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const LobbyScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  //for an animation
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      flexDirection="column" 
      sx={{
        backgroundImage: 'url(https://i.pinimg.com/736x/7e/08/9a/7e089ac5bbb5231398b3dfa522c9aea9.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          textAlign: 'center', 
          backgroundColor: 'rgba(201, 243, 245, 0.8)',
          borderRadius: '16px', 
        }}
      >
        {/*to show that admin is yet to start game*/}
        <Typography variant="h4" gutterBottom>
          Waiting for admin to start the game! ⏳
        </Typography>

        {/* Show animation once the lobby is displayed */}
        {showAnimation && (
          <Box mt={3}>
            {/* Cute animation */}
            <CircularProgress
              color="secondary"
              size={60}
              sx={{
                animation: 'spin 2s linear infinite',
                marginBottom: '20px',
              }}
            />
            <Typography variant="h6">Hang tight! The game will start soon.</Typography>
          </Box>
        )}

        {/* Welcome tip*/}
        <Typography variant="body1" sx={{ marginTop: 3, fontStyle: 'italic' }}>
          Fun Tip: "Get ready to have some fun—you're going to love this game!"
        </Typography>
      </Paper>
    </Box>
  );
};

export default LobbyScreen;
