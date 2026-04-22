import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CreateTournament() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [roundTime, setRoundTime] = useState(300);
  const [numRounds, setNumRounds] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Enter a tournament name');
    if (!user) return toast.error('Login required');

    setCreating(true);
    try {
      const res = await api.post('/tournaments', {
        name,
        description,
        maxPlayers,
        roundTime,
        numRounds,
        startDate: startDate ? new Date(startDate).toISOString() : undefined
      });
      toast.success('Tournament created!');
      navigate(`/tournaments/${res.data.id}`);
    } catch (err) {
      toast.error('Failed to create tournament');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
          <button onClick={() => navigate('/tournaments')} className="hover:text-golf-400 transition">TOURNAMENTS</button>
          <span className="text-dark-600">▸</span>
          <span className="text-gray-400">CREATE</span>
        </div>

        <div className="glass rounded-sm p-8 border border-dark-600">
          <h1 className="text-2xl font-black text-white mb-1 tracking-wider">CREATE TOURNAMENT</h1>
          <p className="text-gray-500 text-sm font-mono mb-8">Set up a multi-round competitive event</p>

          <div className="space-y-5">
            <div>
              <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">TOURNAMENT NAME</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 focus:border-golf-400/50 outline-none text-sm"
                placeholder="e.g. Neon Byte Wars"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">DESCRIPTION</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 focus:border-golf-400/50 outline-none text-sm resize-none h-20"
                placeholder="Describe your tournament..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">PLAYERS</label>
                <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm">
                  {[4, 6, 8, 10, 12, 16].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">ROUNDS</label>
                <select value={numRounds} onChange={e => setNumRounds(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm">
                  {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">TIME/ROUND</label>
                <select value={roundTime} onChange={e => setRoundTime(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm">
                  <option value={120}>2 min</option>
                  <option value={180}>3 min</option>
                  <option value={300}>5 min</option>
                  <option value={600}>10 min</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">START DATE</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-dark-900 rounded-sm p-4 border border-dark-600">
              <h4 className="text-xs text-gray-500 tracking-[0.1em] mb-2">PREVIEW</h4>
              <div className="flex items-center gap-5 text-xs text-gray-400 font-mono">
                <span>👥 {maxPlayers} players</span>
                <span>🎯 {numRounds} random challenges</span>
                <span>⏱️ {roundTime / 60}m per round</span>
                <span>💰 {maxPlayers * 15} ELO pool</span>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-4 bg-accent-pink/10 text-accent-pink rounded-sm font-black text-sm tracking-[0.2em] hover:bg-accent-pink/20 transition disabled:opacity-50 border border-accent-pink/30 neon-glow-pink"
            >
              {creating ? '⏳ CREATING...' : '🏆 CREATE TOURNAMENT'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
