import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

const AdminLobby = () => {
  console.log("we are in lobby");
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canStart, setCanStart] = useState(false);
  const [gameId, setGameId] = useState(null); 

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Session Data:", data);

        const gameIdFromStorage = localStorage.getItem('gameId'); 

        if (gameIdFromStorage) {
          console.log('Game ID found in localStorage:', gameIdFromStorage);
          setGameId(gameIdFromStorage); 
        } else {
          console.log('No game ID in localStorage');
        }

        if (response.ok) {
          const joinedPlayers = data.results?.players || [];
          setPlayers(joinedPlayers);
          setCanStart(joinedPlayers.length >= 2 && joinedPlayers.length <= 5);
        } else {
          console.error('Failed to fetch session data:', data.error);
        }
      } catch (err) {
        console.error('Error fetching session data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
    const interval = setInterval(fetchSessionData, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleStartGame = async () => {
    if (!gameId) {
      console.error('No gameId found, cannot start game.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/admin/game/${gameId}/mutate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mutationType: 'ADVANCE' }), 
      });

      if (response.ok) {
        console.log("mutate passed lets goo");
      } else {
        const data = await response.json();
        console.error('Failed to start game:', data.error);
      }
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://i.pinimg.com/736x/7e/08/9a/7e089ac5bbb5231398b3dfa522c9aea9.jpg)', // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 4,
        py: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(213, 235, 242, 0.95)', // Translucent blue background
          borderRadius: '16px', // Rounded corners
          padding: 4,
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">Game Lobby</Typography>
        <Typography variant="subtitle1" align="center">Session ID: {sessionId}</Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography sx={{ mt: 2, mb: 1 }} align="center">
              {players.length} player{players.length !== 1 ? 's' : ''} joined
            </Typography>

            <List>
              {players.map((player, index) => (
                <ListItem key={index}>
                  <ListItemText primary={typeof player === 'string' ? player : player.name || `Player ${index + 1}`} />
                </ListItem>
              ))}
            </List>

            {canStart ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button variant="contained" color="success" onClick={handleStartGame}>
                  Start Game
                </Button>
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }} align="center">
                Waiting for at least 2 players (max 5) to join...
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminLobby;
