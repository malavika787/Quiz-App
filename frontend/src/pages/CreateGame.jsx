//create game component 
import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Paper, Alert, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const generateQuestionId = () => Date.now() + Math.random(); //to generate a question id for each question
//temporary question cap
const MAX_QUESTIONS = 10;
const DEFAULT_THUMBNAIL = 'https://4kwallpapers.com/images/walls/thumbs_2t/15914.jpg'; //temporarily adding a default thumbnail - will change later

const CreateGame = () => {
  //variable and useState initializations
  const [name, setName] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([{
    id: generateQuestionId(),
    question: '', duration: '', points: '', answers: [
      { text: '', correct: false },
      { text: '', correct: false }
    ]
  }]);
  const [thumbnail, setThumbnail] = useState(null); //user can upload a thumbnail from their computer
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const quizId = Math.floor(Math.random() * 100000000);
  const owner = localStorage.getItem('email'); 
  console.log("owner:", owner); //checking if owner is correct - must remove later
  console.log("quiz ID:", quizId);//debug

  //question text change handler
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[oIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].answers.length < 6) {
      updatedQuestions[qIndex].answers.push({ text: '', correct: false });
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].answers.length > 2) {
      updatedQuestions[qIndex].answers.splice(oIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  //handle game creation
  const handleCreateGame = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question || 'Untitled Question',
      duration: q.duration || 0,
      points: q.points || 0,
      answers: q.answers || []
    }));

    //handle image as Base64 format 
    let imageBase64 = DEFAULT_THUMBNAIL;
    if (thumbnail) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;

        const gamePayload = {
          games: [
            {
              id: quizId,
              name,
              owner,
              thumbnail: imageBase64,
              questions: formattedQuestions,
            }
          ]
        };

        try {
          const response = await fetch('http://localhost:5005/admin/games', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(gamePayload),
          });

          const data = await response.json();
          console.log("create game data:", data);
          if (response.ok) {
            console.log("successful");
            navigate('/home'); //updated to redirect to /home instead of dashboard- was hiding the navbar
          } else {
            setError(data.error || 'Failed to create game');
          }
        } catch (err) {
          console.error('Network error:', err);
          setError('There was an error creating the game. Please try again.');
        }
      };
      reader.readAsDataURL(thumbnail);
    } else {
      const gamePayload = {
        games: [
          {
            id: quizId,
            name,
            owner,
            thumbnail: imageBase64,
            questions: formattedQuestions,
          }
        ]
      };

      try {
        const response = await fetch('http://localhost:5005/admin/games', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gamePayload),
        });

        const data = await response.json();
        console.log("create game data:", data);
        if (response.ok) {
          console.log("successful");
          navigate('/home'); 
        } else {
          setError(data.error || 'Failed to create game');
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('There was an error creating the game. Please try again.');
      }
    }
  };

  //to handle question count change
  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumQuestions(value);
    setQuestions(Array(value).fill().map(() => ({
      id: generateQuestionId(),
      question: '', duration: '', points: '', answers: [
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    })));
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'rgb(178, 232, 245)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          px: 2,
        }}
      >
        <Paper
          component="form"
          onSubmit={handleCreateGame}
          elevation={6}
          sx={{
            backgroundColor: 'rgb(244, 239, 196)',
            padding: 6,
            borderRadius: 4,
            width: '100%',
            maxWidth: 600,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create a New Game
          </Typography>

          {/* game name*/}
          <TextField
            label="Game Name"
            type="text"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'rgb(217, 239, 245)' },
            }}
          />

          {/* thumbnail upload */}
          <Button
            variant="contained"
            component="label"
            sx={{ my: 2 }}
          >
            Upload Thumbnail
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </Button>

          {/* no. of questions */}
          <TextField
            select
            label="Number of Questions"
            fullWidth
            margin="normal"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            InputProps={{
              style: { backgroundColor: 'rgb(217, 239, 245)' },
            }}
          >
            {[...Array(MAX_QUESTIONS)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>

          {/* questions */}
          {questions.map((q, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <TextField
                label={`Question ${index + 1}`}
                type="text"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'rgb(217, 239, 245)' },
                }}
              />
              <TextField
                label="Points"
                type="number"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={q.points}
                onChange={(e) => handleQuestionChange(index, 'points', e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'rgb(217, 239, 245)' },
                  inputProps: { min: 0 }
                }}
              />
              {q.answers.map((option, optIndex) => (
                <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <TextField
                    label={`Option ${optIndex + 1}`}
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, optIndex, 'text', e.target.value)}
                    InputProps={{
                      style: { backgroundColor: 'rgb(217, 239, 245)' },
                    }}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={option.correct}
                      onChange={(e) => handleOptionChange(index, optIndex, 'correct', e.target.checked)}
                    />
                    Correct
                  </label>
                  <Button onClick={() => handleRemoveOption(index, optIndex)} disabled={q.answers.length <= 2}>
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={() => handleAddOption(index)} disabled={q.answers.length >= 6}>
                Add Option
              </Button>
              <TextField
                label="Duration (seconds)"
                type="number"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={q.duration}
                onChange={(e) => handleQuestionChange(index, 'duration', e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'rgb(217, 239, 245)' },
                  inputProps: { min: 0 }
                }}
              />
            </Box>
          ))}

          {/* error*/}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* submission*/}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
          >
            Create Game
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default CreateGame;
