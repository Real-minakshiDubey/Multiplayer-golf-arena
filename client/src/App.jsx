import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Lobby from './pages/Lobby'
import GameRoom from './pages/GameRoom'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import Replays from './pages/Replays'
import ReplayDetail from './pages/ReplayDetail'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import CreateTournament from './pages/CreateTournament'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900 bg-grid">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
        <Route path="/room/:roomCode" element={<ProtectedRoute><GameRoom /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/replays" element={<Replays />} />
        <Route path="/replays/:matchId" element={<ReplayDetail />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/create" element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
        <Route path="/tournaments/:id" element={<TournamentDetail />} />
      </Routes>
    </div>
  )
}