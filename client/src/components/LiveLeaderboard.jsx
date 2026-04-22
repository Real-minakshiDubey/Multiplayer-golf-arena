import { motion, AnimatePresence } from 'framer-motion';

export default function LiveLeaderboard({ leaderboard, currentUserId }) {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <h3 className="font-bold text-gray-300 flex items-center gap-2">
        📊 Live Leaderboard
      </h3>

      <AnimatePresence>
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.userId}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all
              ${entry.userId === currentUserId ? 'bg-golf-400/10 border border-golf-400/30' : 'bg-dark-900/50'}
              ${entry.solved ? '' : 'opacity-60'}`}
          >
            <span className="text-lg w-8 text-center">
              {i < 3 && entry.solved ? medals[i] : `#${i + 1}`}
            </span>
            <span className="text-xl">{entry.avatar}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">
                {entry.username}
                {entry.userId === currentUserId && <span className="text-golf-400 ml-1">(you)</span>}
              </div>
              <div className="text-xs text-gray-500">{entry.attempts} attempts</div>
            </div>
            {entry.solved ? (
              <div className="text-right">
                <div className="font-mono font-bold text-golf-400">{entry.charCount} chars</div>
                <div className="text-xs text-gray-500">{entry.language}</div>
              </div>
            ) : (
              <span className="text-gray-600 text-sm">unsolved</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {leaderboard.length === 0 && (
        <div className="text-center text-gray-600 py-4">
          Waiting for submissions...
        </div>
      )}
    </div>
  );
}