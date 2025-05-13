import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart'; 

const SessionResults = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [sessionActive, setSessionActive] = useState(true);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5005/admin/session/${session_id}/status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const data = await response.json();
        console.log("Fetched session data:", data); 

        setResults(data);
        setSessionActive(data.active);
      } catch (err) {
        console.error("Error fetching session data:", err); 
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchResults();
  }, [session_id]);


  const handleAdvance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/admin/session/${session_id}/mutate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mutationType: 'ADVANCE' }),
      });
      
      if (!response.ok) throw new Error('Failed to advance session');
      console.log('Session advanced');
    } catch (err) {
      console.error("Error advancing session:", err); 
    }
  };

 
  const handleStop = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/admin/game/${session_id}/mutate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mutationType: 'END' }),
      });
      
      if (!response.ok) throw new Error('Failed to stop session');
      console.log('Session stopped');
      setSessionActive(false); 
    } catch (err) {
      console.error("Error stopping session:", err); 
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!results) return <Typography>No results available.</Typography>;

  
  const topPlayers = results.players
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  
  const chartData = topPlayers.map(player => ({
    name: player.name,
    score: player.score,
  }));

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Session Results</Typography>

      {sessionActive ? (
        <>
          <Button variant="contained" onClick={handleAdvance} sx={{ mr: 2 }}>
            Advance Question
          </Button>
          <Button variant="outlined" color="error" onClick={handleStop}>
            Stop Game
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Top 5 Scores</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topPlayers.map((player, idx) => (
                <TableRow key={idx}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Display the chart */}
          <Box sx={{ mt: 4 }}>
            <BarChart
              data={chartData}
              xField="name"
              yField="score"
              seriesField="name"
              label={{
                position: 'top',
                style: { fontSize: 12, fill: '#000' },
              }}
              xAxis={{
                label: { style: { fontSize: 12, fill: '#000' } },
              }}
              yAxis={{
                label: { style: { fontSize: 12, fill: '#000' } },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default SessionResults;

