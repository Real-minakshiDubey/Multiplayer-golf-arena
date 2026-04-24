import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  hard: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
};

const LANG_MAP = {
  python: 'python',
  javascript: 'javascript',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  c: 'c',
  cpp: 'cpp',
  typescript: 'typescript',
  lua: 'lua',
  php: 'php',
  bash: 'shell'
};

export default function ReplayDetail() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSolution, setActiveSolution] = useState(null);

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  const loadMatch = async () => {
    try {
      const res = await api.get(`/matches/${matchId}`);
      setMatch(res.data);
      // Set first solution as active
      const solutionKeys = Object.keys(res.data.solutions || {});
      if (solutionKeys.length > 0) {
        setActiveSolution(solutionKeys[0]);
      }
    } catch {
      toast.error('Match not found');
      navigate('/replays');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  if (!match) return null;

  const colors = DIFFICULTY_COLORS[match.challenge?.difficulty] || DIFFICULTY_COLORS.easy;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
        <button onClick={() => navigate('/replays')} className="hover:text-golf-400 transition">REPLAYS</button>
        <span className="text-dark-600">▸</span>
        <span className="text-gray-400">{match.challenge?.title?.toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Match Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-4"
        >
          {/* Match Overview */}
          <div className="glass rounded-sm p-6 border border-dark-600">
            <span className={`inline-block px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}>
              {match.challenge?.difficulty}
            </span>
            <h1 className="text-2xl font-black text-white mb-2">{match.challenge?.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{match.challenge?.description}</p>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-dark-900 rounded-sm p-3">
                <div className="text-lg font-bold text-golf-400 font-mono">{match.players?.length}</div>
                <div className="text-[10px] text-gray-600 tracking-wider">PLAYERS</div>
              </div>
              <div className="bg-dark-900 rounded-sm p-3">
                <div className="text-lg font-bold text-accent-pink font-mono">{formatDuration(match.duration)}</div>
                <div className="text-[10px] text-gray-600 tracking-wider">DURATION</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600 font-mono">
              Room: {match.room_code} · {new Date(match.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass rounded-sm p-6 border border-dark-600">
            <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-4">FINAL LEADERBOARD</h3>
            <div className="space-y-2">
              {match.leaderboard?.map((entry, i) => (
                <button
                  key={entry.userId}
                  onClick={() => match.solutions[entry.userId] && setActiveSolution(entry.userId)}
                  className={`w-full flex items-center gap-3 p-3 rounded-sm transition-all text-left
                    ${activeSolution === entry.userId
                      ? 'bg-golf-400/10 border border-golf-400/30'
                      : 'bg-dark-900 border border-transparent hover:border-dark-600'
                    }
                    ${match.solutions[entry.userId] ? 'cursor-pointer' : 'cursor-default opacity-60'}
                  `}
                >
                  <span className="text-lg w-8 text-center">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span className="text-lg">{entry.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-200 truncate">{entry.username}</div>
                    <div className="text-[10px] text-gray-600 font-mono">
                      {entry.solved
                        ? `${entry.charCount} chars · ${entry.language} · ${entry.attempts} attempt${entry.attempts !== 1 ? 's' : ''}`
                        : `unsolved · ${entry.attempts} attempt${entry.attempts !== 1 ? 's' : ''}`
                      }
                    </div>
                  </div>
                  {entry.solved && (
                    <span className="text-golf-400 font-mono font-bold text-sm">{entry.charCount}B</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Solution Viewer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          {activeSolution && match.solutions[activeSolution] ? (
            <div className="glass rounded-sm border border-dark-600 overflow-hidden">
              {/* Solution Header */}
              <div className="flex items-center justify-between p-4 border-b border-dark-600">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {match.leaderboard?.find(e => e.userId === activeSolution)?.avatar}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {match.leaderboard?.find(e => e.userId === activeSolution)?.username}'s Solution
                    </h3>
                    <div className="text-[10px] text-gray-600 font-mono">
                      {match.solutions[activeSolution].language} · {match.solutions[activeSolution].charCount} chars
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-golf-400/10 text-golf-400 text-xs font-bold rounded-sm border border-golf-400/20 font-mono">
                    {match.solutions[activeSolution].charCount} B
                  </span>
                </div>
              </div>

              {/* Code Editor (Read-only) */}
              <div className="h-[500px]">
                <Editor
                  height="100%"
                  language={LANG_MAP[match.solutions[activeSolution].language] || 'plaintext'}
                  value={match.solutions[activeSolution].code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    renderLineHighlight: 'none',
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="glass rounded-sm p-16 text-center border border-dark-600">
              <p className="text-4xl mb-4 opacity-50">📝</p>
              <p className="text-gray-500 font-mono text-sm">Select a player from the leaderboard to view their solution</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
