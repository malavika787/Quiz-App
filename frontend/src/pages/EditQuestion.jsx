//edit question component
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
//different question types to handle later
const questionTypes = [
  { value: 'single', label: 'Single Choice' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'judgement', label: 'Judgement' }
];

const EditQuestion = () => {
  const { game_id, question_id } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [gameData, setGameData] = useState(null); 
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState(''); 
  const [mediaContent, setMediaContent] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      //retrieving game and question info
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5005/admin/games', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const game = data.games.find((g) => g.id.toString() === game_id); //to find the game
          if (game) {
            setGameData(game); // Save the game data here
            const question = game.questions.find(q => q.id.toString() === question_id); //to find that specefic q 
            if (question) {
              setQuestionData({ ...question });
              if (question?.media?.youtube) {
                setMediaType('youtube');
                setMediaContent(question.media.youtube);
              } else if (question?.media?.image) {
                setMediaType('image');
                setMediaContent(question.media.image);
              }
            } else {
              setError('Question not found');
            }
          } else {
            setError('Game not found');
          }
        } else {
          setError(data.error || 'Failed to load games');
        }
      } catch (err) {
        setError('Error fetching games');
      }
    };
    fetchGames();
  }, [game_id, question_id]);
  //to handle change in answers
  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...questionData.answers];
    updatedAnswers[index][field] = value;
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };
  //to allow the user to add an option
  const handleAddOption = () => {
    if (questionData.type === 'judgement' && questionData.answers.length < 2) {
      const updatedAnswers = [...questionData.answers, { text: '', correct: false }];
      setQuestionData({ ...questionData, answers: updatedAnswers });
    } else if (questionData.type !== 'judgement' && questionData.answers.length < 6) {
      const updatedAnswers = [...questionData.answers, { text: '', correct: false }];
      setQuestionData({ ...questionData, answers: updatedAnswers });
    }
  };
  //to let the user remove an option
  const handleRemoveOption = (index) => {
    if (questionData.answers.length > 2 || (questionData.type !== 'judgement')) {
      const updatedAnswers = questionData.answers.filter((_, i) => i !== index);
      setQuestionData({ ...questionData, answers: updatedAnswers });
    }
  };
  //to check if at least ONE option is marked correct - needed for all question types
  const validateCorrectAnswers = () => {
    const hasCorrectAnswer = questionData.answers.some(option => option.correct);
    if (!hasCorrectAnswer) {
      setError('At least one option must be marked as correct.');
      return false;
    }
    return true;
  };
  //to save the changes
  const handleSave = async () => {
    if (!validateCorrectAnswers()) return;

    try {
      const token = localStorage.getItem('token');
      const updatedQuestions = { ...questionData };

      //to handle the thumbnail media type
      if (mediaType === 'youtube') {
        updatedQuestions.media = { youtube: mediaContent };
      } else if (mediaType === 'image') {
        updatedQuestions.media = { image: mediaContent };
      } else {
        delete updatedQuestions.media;
      }
      //debug check
      if (!gameData) {
        setError('Game data not available');
        return;
      }

      //to update the question in the array
      const updatedQuestionsList = gameData.questions.map(q => {
        if (q.id.toString() === question_id) {
          return updatedQuestions;
        }
        return q;
      });

      const gamePayload = {
        games: [
          {
            id: gameData.id,
            name: gameData.name,
            owner: gameData.owner,
            thumbnail: gameData.thumbnail,
            questions: updatedQuestionsList
          }
        ]
      };
      //API call to save the changes 
      const res = await fetch('http://localhost:5005/admin/games', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gamePayload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Success!");
        navigate(`/game/${game_id}`);
      } else {
        setError(data.error || 'Failed to save question');
      }
    } catch (err) {
      setError('Error saving question');
    }
  };

  if (!questionData) {
    return <Typography>Loading question...</Typography>;
  }

  const isSingleChoice = questionData.type === 'single';
  const isJudgement = questionData.type === 'judgement';
  const correctAnswersCount = questionData.answers.filter(opt => opt.correct).length;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f0f4f7',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 800, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Edit Question
          </Typography>

          {/*question type*/}
          <TextField
            select
            fullWidth
            label="Question Type"
            value={questionData.type}
            onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
            margin="normal"
          >
            {questionTypes.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>

          {/*question text*/}
          <TextField
            label="Question"
            fullWidth
            margin="normal"
            value={questionData.question}
            onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
          />

          {/*time limit*/}
          <TextField
            label="Time Limit (seconds)"
            type="number"
            fullWidth
            margin="normal"
            value={questionData.duration}
            onChange={(e) => setQuestionData({ ...questionData, duration: Number(e.target.value) })}
          />

          {/*points*/}
          <TextField
            label="Points"
            type="number"
            fullWidth
            margin="normal"
            value={questionData.points}
            onChange={(e) => setQuestionData({ ...questionData, points: Number(e.target.value) })}
          />

          {/*media*/}
          <TextField
            select
            fullWidth
            label="Media Type"
            margin="normal"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="youtube">YouTube URL</MenuItem>
            <MenuItem value="image">Image URL</MenuItem>
          </TextField>

          {mediaType && (
            <TextField
              label={mediaType === 'youtube' ? 'YouTube URL' : 'Image URL'}
              fullWidth
              margin="normal"
              value={mediaContent}
              onChange={(e) => setMediaContent(e.target.value)}
            />
          )}

          {/*answers*/}
          <Typography variant="h6" mt={2}>Answers</Typography>
          {questionData.answers.map((ans, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                label={`Answer ${index + 1}`}
                fullWidth
                value={ans.text}
                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                margin="dense"
              />
              <TextField
                select
                label="Correct"
                fullWidth
                value={ans.correct ? 'true' : 'false'}
                onChange={(e) =>
                  handleAnswerChange(index, 'correct', e.target.value === 'true')
                }
                margin="dense"
                disabled={
                  (isSingleChoice && correctAnswersCount >= 1 && !ans.correct) || //to make sure theres only ONE correct answer for single question types
                  (isJudgement && questionData.answers.length === 2 && ans.correct && correctAnswersCount === 1) //to make sure theres only ONE correct answer for judgement questions
                }
              >
                <MenuItem value="true">Correct</MenuItem>
                <MenuItem value="false">Incorrect</MenuItem>
              </TextField>

              {/*remove Option Button*/}
              {(isJudgement && questionData.answers.length > 2) || (!isJudgement && questionData.answers.length > 2) && (
                <Button
                  color="secondary"
                  onClick={() => handleRemoveOption(index)} //in case its a judgement question - there can only be 2 answers. we should remove 'add option' method for that.
                  sx={{ mt: 1 }}
                >
                  Remove Option
                </Button>
              )}
            </Box>
          ))}

          {/*add Option Button*/}
          {(isJudgement && questionData.answers.length < 2) || (!isJudgement && questionData.answers.length < 6) ? (
            <Button
              variant="contained"
              onClick={handleAddOption}
              sx={{ mt: 2 }}
            >
              Add Option
            </Button>
          ) : null}

          {/*save button*/}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSave}
          >
            Save Question
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default EditQuestion;
