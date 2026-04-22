import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ResultsModal({ results, onClose, currentUserId }) {
  const { leaderboard, solutions, challenge } = results;
  const winner = leaderboard[0];
  const isWinner = winner?.userId === currentUserId && winner?.solved;

  useEffect(() => {
    if (isWinner) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [isWinner]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto space-y-6 animate-slide-up">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            {isWinner ? '🎉 You Won!' : '🏁 Game Over!'}
          </h2>
          <p className="text-gray-400">Challenge: {challenge?.title}</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <div key={entry.userId}
              className={`flex items-center gap-3 p-4 rounded-xl
                ${entry.userId === currentUserId ? 'bg-golf-400/10 border border-golf-400/30' : 'bg-dark-900'}`}>
              <span className="text-2xl w-10 text-center">{i < 3 && entry.solved ? medals[i] : `#${i+1}`}</span>
              <span className="text-xl">{entry.avatar}</span>
              <span className="font-semibold flex-1">{entry.username}</span>
              {entry.solved ? (
                <span className="font-mono font-bold text-golf-400">{entry.charCount} chars</span>
              ) : (
                <span className="text-gray-600">DNF</span>
              )}
            </div>
          ))}
        </div>

        {/* Solutions Replay */}
        {Object.keys(solutions).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-300">💡 Solutions</h3>
            {Object.entries(solutions).map(([userId, sol]) => {
              const player = leaderboard.find(p => p.userId === userId);
              return (
                <div key={userId} className="bg-dark-900 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{player?.username}'s solution ({sol.language})</span>
                    <span className="text-golf-400 font-mono">{sol.charCount} chars</span>
                  </div>
                  <pre className="text-sm text-gray-300 font-mono overflow-x-auto bg-dark-800 p-3 rounded">
                    {sol.code}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose}
          className="w-full py-3 bg-golf-400 text-dark-900 rounded-xl font-bold text-lg hover:bg-golf-500 transition">
          Back to Lobby
        </button>
      </div>
    </div>
  );
}