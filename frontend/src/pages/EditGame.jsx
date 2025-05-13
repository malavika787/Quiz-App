//edit game component
import React, { useEffect, useState } from 'react';
import {TextField,Button,Typography,Box,Paper,Alert} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditGame = () => {
  //initialise usestate and navigate
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    //first - fetch the game with the given game ID 
    try {
      const res = await fetch('http://localhost:5005/admin/games', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await res.json();
      const foundGame = data.games.find((g) => g.id.toString() === gameId); //to make sure the game ID matches

      if (!foundGame) {
        throw new Error('Game not found');
      }

      setGameData(foundGame);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch game data.');
    }
  };
  //to handle changing the questions
  const handleQuestionChange = (field, value) => {
    const updatedQuestions = [...gameData.questions];
    updatedQuestions[selectedQuestionIndex][field] = value;
    setGameData({ ...gameData, questions: updatedQuestions });
  };
  //to handle deleting a question
  const handleDelete = (index) => {
    const updatedQuestions = [...gameData.questions];
    updatedQuestions.splice(index, 1);
    setGameData({ ...gameData, questions: updatedQuestions });
    if (index === selectedQuestionIndex) {
      setSelectedQuestionIndex(null);
    }
  };
  //to handle adding a question
  const handleAdd = () => {
    const newQuestion = { id: Date.now()+Math.random(),  // Temporary ID based on current timestamp
        question: '',
        answer: '',
        duration: 0,
        media: {},
        answers: [], };
    const updatedQuestions = [...gameData.questions, newQuestion];
    setGameData({ ...gameData, questions: updatedQuestions });
    setSelectedQuestionIndex(updatedQuestions.length - 1);
  };
//to save changes
  const handleSave = async () => {
    try {
        const gamePayload = {
            games: [
              {
                id: gameData.id,           
                name: gameData.name,
                owner: gameData.owner,      
                thumbnail: gameData.thumbnail,
                questions: gameData.questions,
              }
            ]
          };
     //API call - PUT to add new data 
      const res = await fetch(`http://localhost:5005/admin/games`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(gamePayload)
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/home');
      } else {
        setError(data.error || 'Failed to update game');
      }
    } catch (err) {
      setError('Network error while saving game');
    }
  };
  //in case of failure / no game data - show loading screen
  if (!gameData) return <Typography>Loading...</Typography>;
  //style 
  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#d6f0f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          px: 0
        }}
      >
        <Box
        component="img"
        src="https://img1.picmix.com/output/stamp/normal/3/5/5/1/2741553_3a949.png"
        alt="hachiware"
        sx={{
          width: 200,
          height: 'auto',
          mb: 0
        }}
      />
        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgb(244, 239, 196)',
            padding: 6,
            borderRadius: 4,
            width: '100%',
            maxWidth: 700
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Edit Game: {gameData.name}
          </Typography>
  
          {gameData.questions.map((q, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/game/${gameId}/question/${q.id}`)}
                sx={{
                  height: '56px',
                  backgroundColor: '#2196f3',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                Edit Question {index + 1}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleDelete(index)}
                sx={{
                  height: '56px',
                  backgroundColor: '#3033d1',
                  '&:hover': {
                    backgroundColor: '#d32f2f'
                  }
                }}
              >
                Delete Question {index + 1}
              </Button>
            </Box>
          ))}
  
          <Button
            variant="contained"
            fullWidth
            onClick={handleAdd}
            sx={{
              height: '56px',
              backgroundColor: '#333333',
              '&:hover': {
                backgroundColor: '#388e3c'
              }
            }}
          >
            Add New Question
          </Button>
  
          <Button
            onClick={handleSave}
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              height: '56px',
              backgroundColor: '#000000',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333'
              }
            }}
          >
            Save Changes
          </Button>
  
          {selectedQuestionIndex !== null && (
            <>
              <TextField
                label="Question"
                fullWidth
                value={gameData.questions[selectedQuestionIndex].question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                margin="normal"
              />
              <TextField
                label="Answer"
                fullWidth
                value={gameData.questions[selectedQuestionIndex].answer}
                onChange={(e) => handleQuestionChange('answer', e.target.value)}
                margin="normal"
              />
              <TextField
                label="Duration (seconds)"
                type="number"
                fullWidth
                value={gameData.questions[selectedQuestionIndex].duration}
                onChange={(e) => handleQuestionChange('duration', e.target.value)}
                margin="normal"
              />
            </>
          )}
  
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default EditGame;


