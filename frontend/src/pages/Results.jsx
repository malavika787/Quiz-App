//game result component
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ResultsScreen = () => {
  const [results, setResults] = useState(null);
  const { playerId } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5005/playerId/${playerId}/results`);
        const data = await response.json();
        if (response.ok) {
          setResults(data);
        } else {
          console.error('Error fetching results:', data.error);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [playerId]);

  if (!results) {
    return <Typography>Loading...</Typography>;
  }

  const { name, answers, questions } = results;

  return (
    <Box sx={{ px: 4, py: 4, backgroundColor: 'rgb(230, 245, 255)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'rgb(33, 150, 243)', mb: 3 }}>
        Game Session Results
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Player: {name}
      </Typography>

      <Grid container spacing={4}>
        {questions.map((question, idx) => (
          <Grid item xs={12} sm={6} key={question.id}>
            <Card sx={{ backgroundColor: 'rgb(255, 243, 196)', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'rgb(33, 150, 243)' }}>
                  Question {idx + 1}: {question.question}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Duration: {question.duration} seconds | Points: {question.points}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Correct Answer: {question.answers.find(ans => ans.correct)?.text || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your Answer: {answers[idx]?.answers.join(', ') || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Correct: {answers[idx]?.correct ? 'Yes' : 'No'} | Time Taken: {answers[idx]?.questionStartedAt ? (answers[idx]?.answeredAt - answers[idx]?.questionStartedAt) / 1000 : 'N/A'} sec
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ backgroundColor: 'rgb(255, 243, 196)', boxShadow: 3, mt: 4 }}>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: 'rgb(33, 150, 243)', ':hover': { backgroundColor: 'rgb(30, 136, 229)' } }}
            onClick={() => navigate('/')}
          >
            Go Back to Dashboard
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ResultsScreen;
