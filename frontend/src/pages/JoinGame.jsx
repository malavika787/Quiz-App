//join game component
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const JoinGame = () => {
  const navigate = useNavigate();
  const { sessionId: sessionIdFromUrl } = useParams();

  const [sessionId, setSessionId] = useState(sessionIdFromUrl || '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  //to let a player join a game
  const handleJoin = async () => {
    if (!sessionId || !name) { //in case theres no session ID or name
      setError('Please enter both session ID and your name.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {//API call to join
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (response.ok) {
        //saving session info locally (temp)
        console.log("FULL JOIN GAME RESPONSE:",data);
        localStorage.setItem('playerName', name);
        localStorage.setItem('sessionId', sessionId);
        //to store player ID:
        const newPlayerId = data.playerId;
        localStorage.setItem('playerId', newPlayerId);
        console.log("Player ID saved:", newPlayerId); //debug
        //for player token
        const playerToken = data.token;
        localStorage.setItem('playerToken', playerToken);
        console.log("JOIN GAME PLAYER TOKEN:",playerToken);
        //navigates to lobby
        navigate(`/play/${sessionId}/game`);//for later
      } else {
        setError(data.error || 'Failed to join session.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while joining.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("https://images.alphacoders.com/134/1345108.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'rgba(243, 228, 245, 0.95)', // softer, slightly transparent
          padding: 6,
          borderRadius: 4,
          width: '100%',
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Join a Game
        </Typography>
  
        <TextField
          label="Session ID"
          fullWidth
          margin="normal"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          disabled={!!sessionIdFromUrl}
          InputProps={{
            style: { backgroundColor: 'rgba(255,248,209,1)' },
          }}
        />
  
        <TextField
          label="Your Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            style: { backgroundColor: 'rgba(255,248,209,1)' },
          }}
        />
  
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
  
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: 'bold',
            backgroundColor: 'rgba(207, 236, 188, 1)',
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(190, 226, 170, 1)',
            },
          }}
          onClick={handleJoin}
        >
          Join
        </Button>
      </Paper>
    </Box>
  );
  
};
export default JoinGame;
