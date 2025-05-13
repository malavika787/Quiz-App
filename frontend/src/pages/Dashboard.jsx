import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CardMedia, Grid, CardActions } from '@mui/material'; //to display the games in card format
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip } from '@mui/material'; //modal that appears upon succesful session creation

const Dashboard = () => {
  //initialising useState and navigate
  const [games, setGames] = useState([]); 
  const navigate = useNavigate();

  //for the session
  const [activeSessions, setActiveSessions] = useState({});


  //the content that needs to work after the component renders
  useEffect(() => {
    const fetchGames = async () => {
      try { //API call to get the game info
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5005/admin/games', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("data", data); //debug step 
        if (response.ok) {
          setGames(data.games); //to keep the games as an object - was array earlier
          console.log(games.questions);
        } else {
          console.error('Error in fetching games:', data.error);
        }
      } catch (error) {
        console.error('Error in fetching games:', error);
      }
    };
    
    fetchGames();
  }, []);
  
  //to calculate the total duration from the duration of each question - seems to be only displaying the duration of the last question. Will fix later because this is a bonus spec for me anyway
  const calculateTotalDuration = (questions) => {
    return Array.isArray(questions)
      ? questions.reduce((total, q) => {
          const duration = Number(q.duration);
          return total + (isNaN(duration) ? 0 : duration);
        }, 0)
      : 0;
  };
  
  //to handle starting a game session
  const [openDialog, setOpenDialog] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const handleStartGame = async (gameId) => {//API call to START session
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/admin/game/${gameId}/mutate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mutationType: 'START' }),
      });
  
      const data = await response.json();
      console.log("session response:",data);//debug
      if (response.ok) {
        setSessionId(data.data.sessionId);
        setOpenDialog(true);
        setActiveSessions((prev) => ({ ...prev, [gameId]: gameId })); //adding active sessions for the stop game later
        localStorage.setItem('gameId', gameId);
      } else {
        console.error('Failed to start game:', data.error);
      }
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };
  //to copy the session link  
  const handleCopyLink = () => {
    if (sessionId) {
      const url = `${window.location.origin}/play/${sessionId}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');//debug
    }
  };

  //to handle stopping a game session
  const handleStopGame = async (gameId) => {
    const token = localStorage.getItem('token');
    console.log("Game ID:",gameId);
    console.log("Active session Game ID:", activeSessions[gameId]);
    try {
      const response = await fetch(`http://localhost:5005/admin/game/${activeSessions[gameId]}/mutate`, {//API call to END session
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mutationType: 'END' }),
      });
  
      if (response.ok) {
        console.log("STOP game response ok");//debug
        setActiveSessions((prev) => {
          const updated = { ...prev };
          delete updated[gameId];
          return updated;
        });
  
        //to prompt the user to see the results - for now result page is blank
        if (window.confirm('Game ended! Would you like to view the results?')) {
          navigate(`/session/${sessionId}`);
        }
      } else {
        console.error('Failed to stop session');
      }
    } catch (err) {
      console.error('Error stopping game:', err);
    }
  };
  

  return (
    <Box sx={{ px: 4, py: 4, backgroundColor: 'rgb(178, 232, 245)', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Game Dashboard
      </Typography>

      <Grid container spacing={4}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={3} key={game.id}>
            <Card sx={{ backgroundColor: 'rgb(244, 239, 196)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              image={game.thumbnail}
              alt={game.name}
              sx={{
                  height: 200,
                  width: '100%',
                  objectFit: 'cover'
              }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>{game.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Questions: {game.questions ? game.questions.length : 0}
                </Typography>
                <Typography variant="body2">
                  Total Duration: {calculateTotalDuration(game.questions)} sec
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              {activeSessions[game.id] ? (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleStopGame(game.id)}
              >
              Stop Game
              </Button>
              ) : (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleStartGame(game.id)}
              >
              Start Game
              </Button>
              )}
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  Edit Game
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>Game Started!</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Session ID: {sessionId}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Share this link:
          <br />
          <code>{`${window.location.origin}/play/${sessionId}`}</code>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCopyLink}>Copy Link</Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            const lobbyUrl = `/adminlobby/${sessionId}`;
            window.open(lobbyUrl, '_blank'); 
          }}
        >
        View Lobby
        </Button>
  <Button onClick={() => setOpenDialog(false)}>Close</Button>
</DialogActions>

      </Dialog>

    </Box>
    
  );


};

export default Dashboard;



