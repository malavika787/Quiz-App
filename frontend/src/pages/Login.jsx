//login component
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
const Login = () => {
  //to initialise the useState
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    //API authentication - POST request
    try {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log(data);
      //if the response is okay - login successful
      if (response.ok) 
      {
        console.log('login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('email', email);
        console.log("email in login phase:",email);
        navigate('/home'); //redirects to home page after login
      } 
      //if the response is not okay - login failed
      else 
      {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('network error:', err);
      setError('There was an error logging you in. Try again.');
    }
  };
  //using MUI components for the login box
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'rgb(178, 232, 245)',
      }}
    >
      {/* navbar- imported from components*/}
      <Navbar />
  
      {/* login form*/}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 6,
          flexDirection: 'column',
        }}
      >
        {/* image - trying to go for a chiikawa theme */}
        <Box sx={{ mb: 3 }}>
          <img
            src="https://nyaa.neocities.org/shrines/shrines%20css/chiikawa/chiikawaemb3_chara_img.png"
            alt="chiikawa"
            style={{
              width: '400px',
              height: 'auto',
            }}
          />
        </Box>
  
        <Paper
          component="form"
          onSubmit={handleSubmit}
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
            Login
          </Typography>
  
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'rgb(217, 239, 245)' },
            }}
          />
  
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'rgb(217, 239, 245)' },
            }}
          />
  
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
  
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
          >
            Login
          </Button>
        </Paper>
  
        {/*signup prompt*/}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" align="center" sx={{ color: 'black' }}>
            New to BigBrain?{' '}
            <Box
              component="span"
              sx={{
                color: 'rgb(74, 91, 188)',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/register'); //to navigate to the signup page
              }}
            >
              Create Account
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  
};

export default Login;

