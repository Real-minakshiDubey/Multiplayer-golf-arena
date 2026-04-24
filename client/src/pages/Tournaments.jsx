import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const STATUS_STYLES = {
  upcoming: { bg: 'bg-accent-purple/10', text: 'text-accent-purple', border: 'border-accent-purple/30', label: 'UPCOMING' },
  active: { bg: 'bg-golf-400/10', text: 'text-golf-400', border: 'border-golf-400/30', label: 'LIVE' },
  completed: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', label: 'COMPLETED' }
};

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' | 'upcoming' | 'active' | 'completed'
  const { user } = useAuth();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const res = await api.get('/tournaments');
      setTournaments(res.data);
    } catch (err) {
      console.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const filtered = tab === 'all'
    ? tournaments
    : tournaments.filter(t => t.status === tab);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getCountdown = (dateStr) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = target - now;
    if (diff <= 0) return 'Starting soon...';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-accent-pink font-mono tracking-[0.5em] text-xs font-bold mb-3">// COMPETITIVE EVENTS</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3 flex items-center gap-4">
          <span className="text-gray-200">TOURNAMENTS</span>
          <span className="text-golf-400 text-2xl font-mono">({filtered.length})</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">Multi-round events — fewest total bytes wins the crown</p>
      </motion.div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { key: 'all', label: 'ALL' },
          { key: 'upcoming', label: '⏳ UPCOMING' },
          { key: 'active', label: '🔴 LIVE' },
          { key: 'completed', label: '🏁 COMPLETED' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-sm text-xs font-bold tracking-[0.15em] transition-all border
              ${tab === t.key
                ? 'bg-golf-400/10 text-golf-400 border-golf-400/30'
                : 'bg-dark-800 text-gray-500 border-dark-600 hover:border-gray-500 hover:text-gray-300'
              }`}
          >
            {t.label}
          </button>
        ))}

        {/* Create Tournament Button */}
        {user?.role === 'admin' && (
          <Link
            to="/tournaments/create"
            className="ml-auto px-5 py-2 rounded-sm text-xs font-bold tracking-[0.15em] border border-accent-pink/30 bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20 transition"
          >
            + CREATE
          </Link>
        )}
      </div>

      {/* Tournament Cards */}
      <div className="space-y-4">
        {filtered.map((tournament, i) => {
          const statusStyle = STATUS_STYLES[tournament.status] || STATUS_STYLES.upcoming;
          const isRegistered = tournament.players?.some(p => p.id === user?.id);

          return (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                to={`/tournaments/${tournament.id}`}
                className="block glass rounded-sm p-6 border border-dark-600 hover:border-golf-400/30 transition-all group hover:shadow-[0_0_15px_rgba(0,255,204,0.08)]"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-[0.15em] ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        {statusStyle.label}
                      </span>
                      {isRegistered && (
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wider bg-golf-400/10 text-golf-400 border border-golf-400/20">
                          REGISTERED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-gray-200 group-hover:text-white transition mb-1 tracking-wide">
                      {tournament.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">{tournament.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600 font-mono flex-wrap">
                      <span>📅 {formatDate(tournament.start_date)}</span>
                      <span>👥 {tournament.players?.length || 0}/{tournament.max_players}</span>
                      <span>🎯 {tournament.num_rounds} rounds</span>
                      <span>⏱️ {tournament.round_time / 60}m/round</span>
                      <span>by {tournament.host_name}</span>
                    </div>
                  </div>

                  {/* Right: ELO Pool + Countdown */}
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="bg-accent-pink/5 border border-accent-pink/20 rounded-sm px-4 py-2">
                      <div className="text-accent-pink font-mono font-bold text-lg">{tournament.elo_pool}</div>
                      <div className="text-[10px] text-gray-600 tracking-wider">ELO POOL</div>
                    </div>

                    {tournament.status === 'upcoming' && (
                      <div className="text-xs text-accent-purple font-mono font-bold animate-pulse">
                        ⏳ {getCountdown(tournament.start_date)}
                      </div>
                    )}

                    {tournament.status === 'completed' && tournament.standings?.[0] && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>{tournament.standings[0].avatar}</span>
                        <span className="text-golf-400 font-bold">{tournament.standings[0].username}</span>
                        <span className="text-gray-600">won</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Player Avatars */}
                <div className="flex items-center gap-1 mt-4">
                  {tournament.players?.slice(0, 10).map((p, j) => (
                    <span key={j} className="text-sm opacity-60 hover:opacity-100 transition" title={p.username}>
                      {p.avatar}
                    </span>
                  ))}
                  {tournament.players?.length > 10 && (
                    <span className="text-xs text-gray-600 font-mono ml-1">+{tournament.players.length - 10}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-sm p-16 text-center border border-dark-600">
          <p className="text-4xl mb-4 opacity-50">🏆</p>
          <p className="text-gray-500 font-mono">No tournaments found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
