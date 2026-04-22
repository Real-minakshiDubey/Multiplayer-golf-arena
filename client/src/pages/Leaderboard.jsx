import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">🏆 Global Leaderboard</h1>

      <div className="space-y-2">
        {users.map((u, i) => (
          <div key={u.id}
            className={`glass rounded-xl p-4 flex items-center gap-4
              ${i < 3 ? 'border-golf-400/20' : ''}`}>
            <span className="text-2xl w-10 text-center font-bold">
              {i < 3 ? medals[i] : `#${i + 1}`}
            </span>
            <span className="text-2xl">{u.avatar}</span>
            <div className="flex-1">
              <div className="font-bold">{u.username}</div>
              <div className="text-xs text-gray-500">{u.games_played} games · {u.games_won} wins</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-golf-400 text-xl">{u.elo}</div>
              <div className="text-xs text-gray-500">ELO</div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="glass rounded-xl p-10 text-center text-gray-500">
            <p className="text-4xl mb-3">🏜️</p>
            <p>No players yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}