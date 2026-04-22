import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ROUND_STATUS_STYLES = {
  pending: { bg: 'bg-dark-800', text: 'text-gray-500', border: 'border-dark-600', dot: 'bg-gray-600' },
  active: { bg: 'bg-golf-400/5', text: 'text-golf-400', border: 'border-golf-400/30', dot: 'bg-golf-400 animate-pulse' },
  completed: { bg: 'bg-green-500/5', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' }
};

const DIFFICULTY_COLORS = {
  easy: 'text-green-400',
  medium: 'text-amber-400',
  hard: 'text-red-400'
};

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadTournament();
  }, [id]);

  const loadTournament = async () => {
    try {
      const res = await api.get(`/tournaments/${id}`);
      setTournament(res.data);
    } catch {
      toast.error('Tournament not found');
      navigate('/tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) return toast.error('Login to register');
    setRegistering(true);
    try {
      const res = await api.post(`/tournaments/${id}/register`);
      setTournament(res.data);
      toast.success('Registered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user) return;
    setRegistering(true);
    try {
      const res = await api.post(`/tournaments/${id}/unregister`);
      setTournament(res.data);
      toast.success('Unregistered');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getCountdown = (dateStr) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = target - now;
    if (diff <= 0) return 'Starting soon...';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    return parts.join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  if (!tournament) return null;

  const isRegistered = tournament.players?.some(p => p.id === user?.id);
  const isHost = tournament.host_id === user?.id;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
        <button onClick={() => navigate('/tournaments')} className="hover:text-golf-400 transition">TOURNAMENTS</button>
        <span className="text-dark-600">▸</span>
        <span className="text-gray-400">{tournament.name.toUpperCase()}</span>
      </div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-sm p-8 border border-dark-600 mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase
                ${tournament.status === 'upcoming' ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/30' :
                  tournament.status === 'active' ? 'bg-golf-400/10 text-golf-400 border border-golf-400/30' :
                  'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                }`}>
                {tournament.status === 'active' ? '🔴 LIVE' : tournament.status.toUpperCase()}
              </span>
              {isHost && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-accent-pink border border-accent-pink/20 rounded-sm">HOST</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wide">{tournament.name}</h1>
            <p className="text-gray-400 text-sm mb-4 max-w-xl">{tournament.description}</p>
            <div className="flex items-center gap-5 text-xs text-gray-600 font-mono flex-wrap">
              <span>📅 {formatDate(tournament.start_date)}</span>
              <span>⏱️ {tournament.round_time / 60}m per round</span>
              <span>by {tournament.host_name}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="bg-dark-900 rounded-sm p-4 text-center min-w-[80px]">
              <div className="text-xl font-bold text-golf-400 font-mono">{tournament.players?.length || 0}</div>
              <div className="text-[10px] text-gray-600 tracking-wider">/{tournament.max_players}</div>
              <div className="text-[10px] text-gray-600 tracking-wider">PLAYERS</div>
            </div>
            <div className="bg-dark-900 rounded-sm p-4 text-center min-w-[80px]">
              <div className="text-xl font-bold text-accent-pink font-mono">{tournament.num_rounds}</div>
              <div className="text-[10px] text-gray-600 tracking-wider">ROUNDS</div>
            </div>
            <div className="bg-dark-900 rounded-sm p-4 text-center min-w-[80px]">
              <div className="text-xl font-bold text-accent-purple font-mono">{tournament.elo_pool}</div>
              <div className="text-[10px] text-gray-600 tracking-wider">ELO POOL</div>
            </div>
          </div>
        </div>

        {/* Countdown / Register */}
        {tournament.status === 'upcoming' && (
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="flex-1 bg-accent-purple/5 border border-accent-purple/20 rounded-sm px-5 py-3">
              <div className="text-xs text-gray-500 font-mono mb-1">STARTS IN</div>
              <div className="text-xl font-black text-accent-purple font-mono animate-pulse">
                {getCountdown(tournament.start_date)}
              </div>
            </div>
            {user && (
              isRegistered ? (
                <button
                  onClick={handleUnregister}
                  disabled={registering}
                  className="px-8 py-4 bg-dark-800 text-gray-400 rounded-sm font-bold text-sm tracking-wider hover:text-red-400 hover:border-red-400/30 transition border border-dark-600 disabled:opacity-50"
                >
                  ✕ UNREGISTER
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="px-8 py-4 bg-golf-400/10 text-golf-400 rounded-sm font-bold text-sm tracking-[0.2em] hover:bg-golf-400/20 transition border border-golf-400/30 neon-glow-cyan disabled:opacity-50"
                >
                  {registering ? '...' : '⚡ REGISTER'}
                </button>
              )
            )}
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Rounds */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-2">ROUNDS</h3>
          {tournament.rounds?.map((round, i) => {
            const style = ROUND_STATUS_STYLES[round.status] || ROUND_STATUS_STYLES.pending;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className={`glass rounded-sm p-5 border ${style.border} transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></div>
                    <span className={`text-sm font-bold ${style.text} tracking-wider`}>
                      ROUND {round.round_number}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${DIFFICULTY_COLORS[round.challenge_difficulty] || 'text-gray-500'}`}>
                      {round.challenge_difficulty}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${style.text}`}>
                    {round.status}
                  </span>
                </div>

                <h4 className="font-bold text-gray-200 mb-3">{round.challenge_title}</h4>

                {/* Round Results */}
                {round.results?.length > 0 && (
                  <div className="space-y-1.5">
                    {round.results.map((r, j) => (
                      <div key={j} className="flex items-center gap-3 text-xs bg-dark-900 p-2 rounded-sm">
                        <span className="w-6 text-center">{j < 3 ? medals[j] : `#${j + 1}`}</span>
                        <span className="flex-1 text-gray-300 font-mono">{r.username}</span>
                        {r.solved ? (
                          <span className="text-golf-400 font-mono font-bold">{r.charCount}B</span>
                        ) : (
                          <span className="text-red-400/50 font-mono">unsolved</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {round.status === 'pending' && (
                  <p className="text-xs text-gray-600 font-mono">Waiting to start...</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right: Standings + Players */}
        <div className="lg:col-span-5 space-y-4">
          {/* Standings */}
          {tournament.standings?.length > 0 && (
            <div className="glass rounded-sm p-5 border border-dark-600">
              <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-4">
                {tournament.status === 'completed' ? '🏆 FINAL STANDINGS' : 'CURRENT STANDINGS'}
              </h3>
              <div className="space-y-2">
                {tournament.standings.map((s, i) => (
                  <div key={s.userId}
                    className={`flex items-center gap-3 p-3 rounded-sm
                      ${i === 0 && tournament.status === 'completed'
                        ? 'bg-golf-400/10 border border-golf-400/30'
                        : 'bg-dark-900'
                      }`}
                  >
                    <span className="text-lg w-8 text-center">
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </span>
                    <span className="text-lg">{s.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-200 truncate">{s.username}</div>
                      <div className="text-[10px] text-gray-600 font-mono">
                        {s.roundsSolved}/{tournament.num_rounds} solved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-golf-400 font-mono font-bold text-sm">{s.totalChars}B</div>
                      <div className="text-[10px] text-gray-600">total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registered Players */}
          <div className="glass rounded-sm p-5 border border-dark-600">
            <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-4">
              PLAYERS ({tournament.players?.length || 0}/{tournament.max_players})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {tournament.players?.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-dark-900 p-2.5 rounded-sm">
                  <span className="text-lg">{p.avatar}</span>
                  <span className="text-xs font-mono text-gray-300 truncate">{p.username}</span>
                  {p.id === tournament.host_id && (
                    <span className="text-[8px] text-accent-pink font-bold ml-auto">HOST</span>
                  )}
                </div>
              ))}
              {/* Empty Slots */}
              {Array.from({ length: tournament.max_players - (tournament.players?.length || 0) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-2 bg-dark-900/30 p-2.5 rounded-sm border border-dashed border-dark-600">
                  <span className="text-lg opacity-20">👤</span>
                  <span className="text-xs text-gray-700 font-mono">open slot</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
