import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateGame from './pages/CreateGame';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import SessionResults from './pages/SessionResults';
import JoinGame from './pages/JoinGame';
import PlayGame from './pages/PlayGame.jsx';
import AdminLobby from './pages/AdminLobby.jsx';
import LobbyScreen from './pages/LobbyScreen.jsx';
import Results from './pages/Results.jsx';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creategame" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<EditGame />} />
        <Route path="/game/:game_id/question/:question_id" element={<EditQuestion />} />
        <Route path="/session/:session_id" element={<SessionResults />} />
        <Route path="/play/:sessionId" element={<JoinGame />} />
        <Route path="/play/:sessionId/game" element={<PlayGame />} />
        <Route path="/adminlobby/:sessionId" element={<AdminLobby />} />
        <Route path="/lobbyscreen" element={<LobbyScreen />} />
        <Route path="/results/:playerId" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
