import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const winRate = user.games_played > 0
    ? Math.round((user.games_won / user.games_played) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">{user.avatar}</div>
        <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
        <p className="text-gray-400 mb-8">{user.email}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-900 rounded-xl p-4">
            <div className="text-3xl font-bold text-golf-400">{user.elo}</div>
            <div className="text-sm text-gray-400">ELO Rating</div>
          </div>
          <div className="bg-dark-900 rounded-xl p-4">
            <div className="text-3xl font-bold text-accent-purple">{user.games_played}</div>
            <div className="text-sm text-gray-400">Games Played</div>
          </div>
          <div className="bg-dark-900 rounded-xl p-4">
            <div className="text-3xl font-bold text-accent-yellow">{user.games_won}</div>
            <div className="text-sm text-gray-400">Wins ({winRate}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}