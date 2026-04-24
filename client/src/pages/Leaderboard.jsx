import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Target, Zap, Search, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

const PodiumEntry = ({ user, rank, delay }) => {
  const configs = {
    1: { color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'podium-1', size: 'scale-110' },
    2: { color: 'text-gray-300', border: 'border-gray-300/30', bg: 'podium-2', size: 'scale-100' },
    3: { color: 'text-orange-500', border: 'border-orange-500/30', bg: 'podium-3', size: 'scale-95' }
  };

  const config = configs[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative flex flex-col items-center p-6 rounded-2xl glass ${config.bg} ${config.size} border-t-2`}
    >
      <div className="absolute -top-4 bg-dark-950 p-2 rounded-full border border-white/10">
        {rank === 1 ? <Trophy className="w-6 h-6 text-yellow-400" /> : <Medal className={`w-6 h-6 ${config.color}`} />}
      </div>
      <div className="text-5xl mb-3 mt-2">{user.avatar}</div>
      <div className="font-black text-white text-lg tracking-tight mb-1 truncate w-full text-center">{user.username}</div>
      <div className={`font-mono font-black text-2xl ${config.color}`}>{user.elo}</div>
      <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">ELO RATING</div>
    </motion.div>
  );
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-golf-400"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-golf-400 animate-pulse" />
        </div>
      </div>
    );
  }

  const top3 = filteredUsers.slice(0, 3);
  const rest = filteredUsers.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 bg-mesh min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-golf-400/10 border border-golf-400/20 mb-6"
        >
          <Trophy className="w-4 h-4 text-golf-400" />
          <span className="text-xs font-bold tracking-widest text-golf-400 uppercase">Hall of Fame</span>
        </motion.div>
        <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter">
          Global <span className="text-gradient-golf">Leaderboard</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">
          The elite arena of minimalists. Every byte counts in the quest for the ultimate code golf mastery.
        </p>
      </div>

      {/* Podium Section */}
      {search === '' && top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
          <div className="order-2 md:order-1">
            {top3[1] && <PodiumEntry user={top3[1]} rank={2} delay={0.2} />}
          </div>
          <div className="order-1 md:order-2">
            {top3[0] && <PodiumEntry user={top3[0]} rank={1} delay={0.1} />}
          </div>
          <div className="order-3">
            {top3[2] && <PodiumEntry user={top3[2]} rank={3} delay={0.3} />}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text"
          placeholder="Search champions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-golf-400/50 transition-all placeholder:text-gray-600 font-medium"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Rank</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Player</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Elo Rating</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Performance</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {(search === '' ? rest : filteredUsers).map((u, i) => {
                  const actualRank = search === '' ? i + 4 : i + 1;
                  const winRate = u.games_played > 0 ? Math.round((u.games_won / u.games_played) * 100) : 0;
                  
                  return (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono font-bold text-gray-600 group-hover:text-golf-400 transition-colors">
                          #{actualRank.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{u.avatar}</span>
                          <div>
                            <div className="font-bold text-white group-hover:text-golf-400 transition-colors flex items-center gap-1">
                              {u.username}
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">CHAMPION</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-golf-400" />
                          <span className="font-mono font-black text-white text-lg">{u.elo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400">{u.games_won} WINS</span>
                            <span className="text-[10px] text-gray-600 font-bold">{u.games_played} TOTAL</span>
                          </div>
                          <div className="h-1 w-20 bg-dark-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${winRate}%` }}
                              className="h-full bg-gradient-to-r from-golf-400 to-accent-cyan"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`font-mono font-black ${winRate >= 50 ? 'text-green-400' : 'text-gray-400'}`}>
                          {winRate}%
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <Target className="w-16 h-16 text-gray-800 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Champions Found</h3>
            <p className="text-gray-700 font-medium">Try searching for a different username or invite a friend!</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs font-bold text-gray-700 tracking-[0.3em] uppercase">Updated every match in real-time</p>
      </div>
    </div>
  );
}