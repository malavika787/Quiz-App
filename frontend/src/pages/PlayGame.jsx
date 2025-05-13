//play game component
//followed the SwaggerUI exactly and tried MANY ways to resolve conflict. Tried to do curl directly in terminal. No matter what, it either times out or shows internal error.
//will come back to it at the end 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, RadioGroup, Radio, FormControlLabel, Checkbox, LinearProgress } from '@mui/material';
import LobbyScreen from './LobbyScreen'; 
const PlayGame = () => {
  const [question, setQuestion] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [questionType, setQuestionType] = useState('');
  const [media, setMedia] = useState(null);

  // Correctly retrieve playerId and playerToken from localStorage
  const playerId = localStorage.getItem('playerId');
  console.log("player ID:", playerId);

  const playerToken = localStorage.getItem('playerToken');  // Fix: pass the string 'playerToken' here
  console.log("player Token:", playerToken);

  const token = localStorage.getItem('token');
  console.log("token:",token);

  useEffect(() => {
    if (!playerId) return;
    const interval = setInterval(fetchCurrentQuestion, 2000);
    return () => clearInterval(interval);
  }, [playerId]);

  const fetchCurrentQuestion = async () => {
    try {
      const res = await fetch(`http://localhost:5005/play/${playerId}/question`);
      const data = await res.json();
      console.log("player data:", data);
      console.log("question data", data);

      if (data.question) {
        setGameStarted(true);
        setQuestion(data.question);
        setQuestionIndex(data.question.position);
        setQuestionType(data.question.type);
        setTimeLeft(data.question.timeLeft);
        setMedia(data.question.media || null);
        setShowResults(data.question.timeLeft === 0);
      } else {
        setGameStarted(false);
        console.log("We are here");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSingleAnswer = (answer) => {
    setSelected([parseInt(answer)]);
  };

  const handleSubmit = async () => {
    console.log("Selected answers before submitting:", selected);

    const answersToSubmit = questionType === 'single'
      ? [question.answers[selected[0]].text]
      : selected.map(idx => question.answers[idx].text);

    console.log("Answers to submit:", answersToSubmit);

    const answerObj = {
      questionStartedAt: new Date().toISOString(),
      answeredAt: new Date().toISOString(),
      answers: answersToSubmit,
      correct: false
    };

    try {
      await fetch(`http://localhost:5005/play/${playerId}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //tried with and without token - same issue
        },
        body: JSON.stringify({
          "answers": answersToSubmit,
        }),
      });

      setShowResults(true);

      setTimeout(fetchCurrentQuestion, 2000);
      if (timeLeft <= 0) {
        console.warn("Too late! Time's up.");
        return;
      }

    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  if (!playerId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">No player ID found. Please join the game first.</Typography>
      </Box>
    );
  }

  if (!gameStarted) {
    return <LobbyScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'rgb(255, 240, 250)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 700 }}>
        <Typography variant="h5" gutterBottom>
          Question 
        </Typography>
        <Typography variant="h6" gutterBottom>
          {question.question}
        </Typography>
  
        {media && (
          <>
            {media.type === 'image' && <img src={media.src} alt="question media" width="100%" />}
            {media.type === 'video' && (
              <video width="100%" controls>
                <source src={media.src} type="video/mp4" />
              </video>
            )}
          </>
        )}
  
        {!showResults && (
          <>
            <Typography sx={{ mt: 2 }}>Time Left: {timeLeft}s</Typography>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / question.duration) * 100} // Use question.duration instead of timeLimit
              sx={{ height: 10, my: 1 }}
            />
            {Array.isArray(question.answers) && question.answers.length > 0 ? (
              questionType === 'single' ? (
                <RadioGroup value={selected[0] || ''} onChange={(e) => handleSingleAnswer(e.target.value)}>
                  {question.answers.map((ans, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={idx}
                      control={<Radio />}
                      label={ans.text}
                    />
                  ))}
                </RadioGroup>
              ) : (
                question.answers.map((ans, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={
                      <Checkbox
                        checked={selected.includes(idx)}
                        onChange={() => {
                          // Toggle selection of answers
                          const updated = [...selected];
                          if (updated.includes(idx)) {
                            updated.splice(updated.indexOf(idx), 1);
                          } else {
                            updated.push(idx);
                          }
                          setSelected(updated);
                        }}
                      />
                    }
                    label={ans.text}
                  />
                ))
              )
            ) : (
              <Typography color="error">No available answers for this question.</Typography>
            )}
  
            {/* Add the submit button */}
            <Box sx={{ mt: 3 }}>
              <button onClick={handleSubmit}>Submit Answer</button>
            </Box>
          </>
        )}
  
        {showResults && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Results:</Typography>
            {Array.isArray(question.answers) && question.answers.length > 0 ? (
              question.answers.map((ans, idx) => (
                <Typography
                  key={idx}
                  sx={{
                    color: ans.correct ? 'green' : 'black',
                    fontWeight: selected.includes(idx) ? 'bold' : 'normal',
                  }}
                >
                  {ans.text} {ans.correct ? '(Correct)' : ''}
                </Typography>
              ))
            ) : (
              <Typography color="error">No available answers for this question.</Typography>
            )}
            <Typography sx={{ mt: 2 }} color="textSecondary">
              Waiting for next question...
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );  
};

export default PlayGame;
