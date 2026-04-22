import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const DIFFICULTY_COLORS = {
  easy: 'text-green-400',
  medium: 'text-amber-400',
  hard: 'text-red-400'
};

export default function Replays() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (err) {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const filtered = matches.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.challenge?.title?.toLowerCase().includes(q)
      || m.room_name?.toLowerCase().includes(q)
      || m.winner?.username?.toLowerCase().includes(q)
      || m.players?.some(p => p.username.toLowerCase().includes(q));
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
        <p className="text-accent-pink font-mono tracking-[0.5em] text-xs font-bold mb-3">// MATCH ARCHIVES</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3 flex items-center gap-4">
          <span className="text-gray-200">REPLAYS</span>
          <span className="text-golf-400 text-2xl font-mono">({filtered.length})</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">Review past matches, study winning solutions</p>
      </motion.div>

      {/* Search */}
      <div className="glass rounded-sm p-4 mb-8">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-dark-900 rounded-sm border border-dark-600 focus:border-golf-400/50 outline-none font-mono text-sm text-gray-300 placeholder-gray-600"
          placeholder="⌕ Search by challenge, player, or room..."
        />
      </div>

      {/* Match List */}
      <div className="space-y-3">
        {filtered.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
          >
            <Link
              to={`/replays/${match.id}`}
              className="block glass rounded-sm p-5 border border-dark-600 hover:border-golf-400/30 transition-all group hover:shadow-[0_0_15px_rgba(0,255,204,0.08)]"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Left: Challenge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-200 group-hover:text-white transition truncate">
                      {match.challenge?.title || 'Unknown Challenge'}
                    </h3>
                    <span className={`text-[10px] font-bold tracking-[0.15em] uppercase ${DIFFICULTY_COLORS[match.challenge?.difficulty] || 'text-gray-500'}`}>
                      {match.challenge?.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-mono">
                    <span>{match.room_name}</span>
                    <span>·</span>
                    <span>{match.players?.length || 0} players</span>
                    <span>·</span>
                    <span>{formatDuration(match.duration)}</span>
                    <span>·</span>
                    <span>{formatDate(match.created_at)}</span>
                  </div>
                </div>

                {/* Right: Winner */}
                <div className="flex items-center gap-3">
                  {match.winner ? (
                    <div className="flex items-center gap-2 bg-golf-400/5 border border-golf-400/20 rounded-sm px-3 py-2">
                      <span className="text-lg">{match.winner.avatar}</span>
                      <div className="text-right">
                        <div className="text-xs font-bold text-golf-400">{match.winner.username}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{match.winner.charCount} chars</div>
                      </div>
                      <span className="text-golf-400 text-xs">👑</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600 font-mono">No winner</span>
                  )}
                </div>
              </div>

              {/* Player Avatars Row */}
              <div className="flex items-center gap-1 mt-3">
                {match.players?.map((p, j) => (
                  <span key={j} className="text-sm opacity-60 hover:opacity-100 transition" title={p.username}>
                    {p.avatar}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-sm p-16 text-center border border-dark-600">
          <p className="text-4xl mb-4 opacity-50">📼</p>
          <p className="text-gray-500 font-mono">No replays found. Play some matches first!</p>
        </div>
      )}
    </div>
  );
}
