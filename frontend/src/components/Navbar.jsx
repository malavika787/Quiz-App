//navbar component to add to any page
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout, showCreateButton }) {//adding logout button only if user is already logged in
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      sx={{
        backgroundColor: 'rgb(244, 239, 196)',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          color: 'rgb(74, 91, 188)',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          px: 2.5,
          py: 1.2,
          borderRadius: '50%',
          boxShadow: 2,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        BigBrain
      </Box>

      {/*logout + create game buttons - only if logged in*/}
      {isLoggedIn && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          {showCreateButton && ( //accepts a showCreateButton value - true if it needs to show, and ill add 'true' whenever 'Dashboard' component is used
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/creategame')}
              sx={{ fontWeight: 'bold', textTransform: 'none' }}
            >
              Create Game
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={onLogout}
            sx={{ fontWeight: 'bold', textTransform: 'none' }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}

