import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  hard: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
};

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'arrays', label: 'ARRAYS', icon: '📊' },
  { id: 'two-pointers', label: 'TWO POINTERS', icon: '👈👉' },
  { id: 'sliding-window', label: 'SLIDING WINDOW', icon: '🪟' },
  { id: 'stack-queue', label: 'STACK / QUEUE', icon: '📚' },
  { id: 'binary-search', label: 'BINARY SEARCH', icon: '🔍' },
  { id: 'graphs', label: 'GRAPHS', icon: '🕸️' },
  { id: 'dp', label: 'DP', icon: '🧠' },
  { id: 'strings', label: 'STRINGS', icon: '🔤' },
  { id: 'math', label: 'MATH', icon: '🔢' }
];

export default function Problems() {
  const [challenges, setChallenges] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadChallenges();
  }, [user]);

  const loadChallenges = async () => {
    try {
      const res = await api.get('/challenges');
      setChallenges(res.data);

      if (user) {
        try {
          const solvedRes = await api.get('/submissions/solved');
          setSolvedIds(solvedRes.data);
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const filtered = challenges.filter(c => {
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
    if (category !== 'all' && c.category !== category) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Count per category
  const categoryCounts = {};
  CATEGORIES.forEach(cat => {
    if (cat.id === 'all') {
      categoryCounts[cat.id] = challenges.filter(c => {
        if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
        return true;
      }).length;
    } else {
      categoryCounts[cat.id] = challenges.filter(c => {
        if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
        return c.category === cat.id;
      }).length;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-accent-pink font-mono tracking-[0.5em] text-xs font-bold mb-3">// CHALLENGE VAULT</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3 flex items-center gap-4">
          <span className="text-gray-200">PROBLEMS</span>
          <span className="text-golf-400 text-2xl font-mono">({filtered.length})</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm">Practice solo or create an arena room to compete</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Sidebar — Categories */}
        <div className="lg:col-span-3">
          <div className="glass rounded-sm p-4 border border-dark-600 sticky top-24 space-y-1">
            <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-3 px-2">TOPICS</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all text-left
                  ${category === cat.id
                    ? 'bg-golf-400/10 text-golf-400 border border-golf-400/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800 border border-transparent'
                  }`}
              >
                <span className="flex items-center gap-2">
                  {cat.icon && <span className="text-sm">{cat.icon}</span>}
                  <span className="tracking-wider">{cat.label}</span>
                </span>
                <span className={`text-[10px] font-mono ${category === cat.id ? 'text-golf-400' : 'text-gray-700'}`}>
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Problem List */}
        <div className="lg:col-span-9">
          {/* Filter Bar */}
          <div className="glass rounded-sm p-4 mb-6 flex flex-col md:flex-row items-center gap-4 border border-dark-600">
            <div className="flex gap-2">
              {['all', 'easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-sm text-xs font-bold tracking-[0.15em] uppercase transition-all
                    ${difficulty === d
                      ? d === 'all'
                        ? 'bg-golf-400/20 text-golf-400 border border-golf-400/30'
                        : `${DIFFICULTY_COLORS[d]?.bg} ${DIFFICULTY_COLORS[d]?.text} border ${DIFFICULTY_COLORS[d]?.border}`
                      : 'bg-dark-800 text-gray-500 border border-dark-600 hover:border-gray-500 hover:text-gray-300'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex-1 w-full md:w-auto">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 rounded-sm border border-dark-600 focus:border-golf-400/50 outline-none font-mono text-sm text-gray-300 placeholder-gray-600"
                placeholder="⌕ Search problems..."
              />
            </div>
          </div>

          {/* Challenge Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((challenge, i) => {
              const colors = DIFFICULTY_COLORS[challenge.difficulty] || DIFFICULTY_COLORS.easy;
              const isSolved = solvedIds.includes(challenge.id);
              const catInfo = CATEGORIES.find(c => c.id === challenge.category);

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.03 * i, 0.5) }}
                  className="h-full"
                >
                  <Link
                    to={`/problems/${challenge.id}`}
                    className="h-full flex flex-col glass rounded-sm p-5 border border-dark-600 hover:border-golf-400/40 transition-all group hover:shadow-[0_0_20px_rgba(0,255,204,0.1)] relative overflow-hidden"
                  >
                    {/* Solved Badge */}
                    {isSolved && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs">
                        ✓
                      </div>
                    )}

                    {/* Tags Row */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {challenge.difficulty}
                      </span>
                      {catInfo && catInfo.id !== 'all' && (
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wider text-gray-500 bg-dark-800 border border-dark-600">
                          {catInfo.icon} {catInfo.label}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-gray-200 mb-2 group-hover:text-white transition font-mono tracking-wide">
                      {challenge.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
                      {challenge.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-3 text-[10px] text-gray-600 font-mono mt-auto">
                      <span><span className="text-golf-400/60">▸</span> {challenge.examples?.length || 0} examples</span>
                      <span><span className="text-accent-pink/60">◆</span> {challenge.testCases?.length || 0} tests</span>
                    </div>

                    {/* Hover Glow Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-golf-400/0 to-transparent group-hover:via-golf-400/60 transition-all duration-500"></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="glass rounded-sm p-16 text-center border border-dark-600">
              <p className="text-4xl mb-4 opacity-50">🔍</p>
              <p className="text-gray-500 font-mono">No problems match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
