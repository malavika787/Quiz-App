//register component
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const Register = () => {
    //useState
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    //function to handle form submission
    const handleSubmit = async (e) => {
        //to prevent default and blanks
        e.preventDefault();
        setError('');
        //if the values of 'password' and 'confirm password' are not the same, alert shows
        if (password !== confirmPassword) 
        {
            alert("Passwords don't match");
            return;
        }
        //API authentication 
        try {
            const response = await fetch('http://localhost:5005/admin/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', 
              },
              body: JSON.stringify({ email, password, name}),
            }); 
            const data = await response.json();
            console.log(data); //to debug
            //if the response is okay - signup successful
            if(response.ok)
            {
                localStorage.setItem('token', data.token);
                navigate('/login');
            }
            else 
            {
                setError(data.error || 'Registration failed');
            }
        }
        catch(err){
            console.error('Network error:', err);
            setError('There was an error registering. Please try again.');
        }
}
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
          py: 0,
        }}
      >
        {/* chiikawa image above signup box */}
        <Box sx={{ mb: 0 }}>
          <img
            src="https://imgcdn.sigstick.com/hyOQ4HsUpWFKebtaC5SO/cover-1.thumb256.webp"
            alt="Chiikawa YahaUsagi"
            style={{
              width: '170px',
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
            Register
          </Typography>
  
          {/* name field*/}
          <TextField
            label="Name"
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
  
          {/* email field */}
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
  
          {/* password field */}
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
  
          {/* confirm password field */}
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'rgb(217, 239, 245)' },
            }}
          />
  
          {/* error message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
  
          {/* submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
          >
            Register
          </Button>
        </Paper>
  
        {/* login prompt */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" align="center" sx={{ color: 'black' }}>
            Already have an account?{' '}
            <Box
              component="span"
              sx={{
                color: 'rgb(74, 91, 188)',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Box>
          </Typography>
        </Box>
      </Box>
    </>
  );  
};

export default Register;

