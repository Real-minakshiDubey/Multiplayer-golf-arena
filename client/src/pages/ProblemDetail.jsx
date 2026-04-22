import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import CodeEditor from '../components/CodeEditor';
import CharCounter from '../components/CharCounter';
import { LANGUAGES, STARTER_CODE } from '../utils/constants';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  easy: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  hard: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
};

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('solo');    // 'solo' | 'compete'
  
  // Solo practice state
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE['python']);
  const [charCount, setCharCount] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [personalBest, setPersonalBest] = useState(null);

  // Compete state
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roundTime, setRoundTime] = useState(300);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  useEffect(() => {
    setCharCount(code.replace(/\s/g, '').length);
  }, [code]);

  const loadChallenge = async () => {
    try {
      const res = await api.get(`/challenges/${id}`);
      setChallenge(res.data);
      
      if (user) {
        try {
          const bestRes = await api.get(`/submissions/best/${id}`);
          setPersonalBest(bestRes.data);
        } catch {}
      }
    } catch {
      toast.error('Challenge not found');
      navigate('/problems');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang] || '');
  };

  const handleRun = async () => {
    if (!user) return toast.error('Login to practice');
    setRunning(true);
    try {
      const res = await api.post('/submissions/run', { code, language, challengeId: id });
      setTestResults(res.data.results);
      if (res.data.allPassed) {
        toast.success(`Examples pass! ${res.data.charCount} chars`);
      } else {
        toast.error('Some examples failed');
      }
    } catch (err) {
      toast.error('Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return toast.error('Login to submit');
    setSubmitting(true);
    try {
      const res = await api.post('/submissions/practice', { code, language, challengeId: id });
      setTestResults(res.data.results);
      if (res.data.allPassed) {
        toast.success(`✅ All tests passed! ${res.data.charCount} characters`);
        // Update personal best
        if (!personalBest || res.data.charCount < personalBest.char_count) {
          setPersonalBest({ char_count: res.data.charCount, language });
        }
      } else {
        const failCount = res.data.results.filter(t => !t.passed).length;
        toast.error(`❌ ${failCount} test(s) failed`);
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!user) return toast.error('Login to compete');
    if (!socket) return toast.error('Not connected');
    setCreating(true);

    try {
      const res = await api.post('/rooms', {
        name: roomName || `${challenge.title} Arena`,
        maxPlayers,
        roundTime,
        challengeId: id
      });
      const { code: roomCode } = res.data;

      socket.emit('create-room', {
        roomCode,
        roomName: roomName || `${challenge.title} Arena`,
        maxPlayers,
        roundTime,
        challengeId: id
      }, (response) => {
        if (response.success) {
          navigate(`/room/${roomCode}`);
        } else {
          toast.error('Failed to create room');
        }
        setCreating(false);
      });
    } catch (err) {
      toast.error('Failed to create room');
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-golf-400"></div>
      </div>
    );
  }

  if (!challenge) return null;

  const colors = DIFFICULTY_COLORS[challenge.difficulty] || DIFFICULTY_COLORS.easy;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
        <button onClick={() => navigate('/problems')} className="hover:text-golf-400 transition">PROBLEMS</button>
        <span className="text-dark-600">▸</span>
        <span className="text-gray-400">{challenge.title.toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Problem Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="glass rounded-sm p-6 border border-dark-600 sticky top-24">
            {/* Difficulty + Title */}
            <span className={`inline-block px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}>
              {challenge.difficulty}
            </span>
            <h1 className="text-2xl font-black text-white mb-4 tracking-wide">{challenge.title}</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{challenge.description}</p>

            {/* I/O Format */}
            <div className="space-y-3 mb-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-1">INPUT</h4>
                <p className="text-gray-400 text-xs font-mono">{challenge.inputFormat}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-1">OUTPUT</h4>
                <p className="text-gray-400 text-xs font-mono">{challenge.outputFormat}</p>
              </div>
            </div>

            {/* Examples */}
            <h4 className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-3">EXAMPLES</h4>
            <div className="space-y-2">
              {challenge.examples?.map((ex, i) => (
                <div key={i} className="bg-dark-900 rounded-sm p-3 border border-dark-600">
                  <div className="flex items-center gap-2 text-xs font-mono mb-1">
                    <span className="text-golf-400/60">IN:</span>
                    <span className="text-gray-300">{ex.input}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-accent-pink/60">OUT:</span>
                    <span className="text-gray-300">{ex.output}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Best */}
            {personalBest && (
              <div className="mt-6 p-3 bg-golf-400/5 border border-golf-400/20 rounded-sm">
                <h4 className="text-xs font-bold text-golf-400 tracking-[0.2em] mb-1">🏆 YOUR BEST</h4>
                <p className="text-golf-400 font-mono text-lg font-bold">{personalBest.char_count} <span className="text-xs text-gray-500">chars</span></p>
                <p className="text-gray-600 text-xs font-mono">{personalBest.language}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Action Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          {/* Tab Selector */}
          <div className="flex mb-4 border border-dark-600 rounded-sm overflow-hidden">
            <button
              onClick={() => setTab('solo')}
              className={`flex-1 py-3 text-sm font-bold tracking-[0.15em] transition-all ${
                tab === 'solo'
                  ? 'bg-golf-400/10 text-golf-400 border-b-2 border-golf-400'
                  : 'bg-dark-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              ⚡ SOLO PRACTICE
            </button>
            <button
              onClick={() => setTab('compete')}
              className={`flex-1 py-3 text-sm font-bold tracking-[0.15em] transition-all ${
                tab === 'compete'
                  ? 'bg-accent-pink/10 text-accent-pink border-b-2 border-accent-pink'
                  : 'bg-dark-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              🏟️ COMPETE
            </button>
          </div>

          {/* Solo Practice Tab */}
          {tab === 'solo' && (
            <div className="space-y-3">
              {/* Language Select */}
              <div className="flex items-center gap-2 flex-wrap">
                {LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition
                      ${language === lang.id
                        ? 'bg-golf-400/20 text-golf-400 border border-golf-400/30'
                        : 'bg-dark-700 text-gray-500 hover:text-white border border-transparent'}`}>
                    {lang.icon} {lang.name}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <CodeEditor language={language} value={code} onChange={setCode} />

              <CharCounter count={charCount} />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={handleRun} disabled={running}
                  className="flex-1 py-3 bg-dark-700 text-gray-300 rounded-sm font-bold text-sm tracking-wider hover:bg-dark-600 transition disabled:opacity-50 border border-dark-600">
                  {running ? '⏳ RUNNING...' : '▶ RUN (EXAMPLES)'}
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-3 bg-golf-400/10 text-golf-400 rounded-sm font-bold text-sm tracking-wider hover:bg-golf-400/20 transition disabled:opacity-50 border border-golf-400/30 neon-glow-cyan">
                  {submitting ? '⏳ JUDGING...' : '🚀 SUBMIT'}
                </button>
              </div>

              {/* Test Results */}
              {testResults && (
                <div className="glass rounded-sm p-4 space-y-2 border border-dark-600">
                  <h4 className="font-bold text-xs text-gray-500 tracking-[0.2em]">TEST RESULTS</h4>
                  {testResults.map((t, i) => (
                    <div key={i} className={`flex items-start gap-2 text-sm p-3 rounded-sm ${t.passed ? 'bg-green-500/5 border border-green-500/10' : 'bg-red-500/5 border border-red-500/10'}`}>
                      <span>{t.passed ? '✅' : '❌'}</span>
                      <div className="flex-1 font-mono text-xs">
                        <div>Input: <span className="text-gray-300">{t.input}</span></div>
                        <div>Expected: <span className="text-golf-400">{t.expected}</span></div>
                        <div>Got: <span className={t.passed ? 'text-golf-400' : 'text-red-400'}>{t.actual || '(empty)'}</span></div>
                        {t.error && <div className="text-red-400 mt-1">{t.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Compete Tab */}
          {tab === 'compete' && (
            <div className="glass rounded-sm p-8 border border-dark-600">
              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-white tracking-wider mb-2">CREATE ARENA ROOM</h3>
                <p className="text-gray-500 text-sm font-mono">
                  Challenge: <span className="text-accent-pink">{challenge.title}</span> — locked in for all players
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">ROOM NAME</label>
                  <input
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-900 rounded-sm border border-dark-600 focus:border-accent-pink/50 outline-none text-sm"
                    placeholder={`${challenge.title} Arena`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">MAX PLAYERS</label>
                  <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm">
                    {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} players</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block tracking-[0.1em]">ROUND TIME</label>
                  <select value={roundTime} onChange={e => setRoundTime(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-dark-900 rounded-sm border border-dark-600 outline-none text-sm">
                    <option value={120}>2 minutes</option>
                    <option value={180}>3 minutes</option>
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="w-full py-4 bg-accent-pink/10 text-accent-pink rounded-sm font-black text-sm tracking-[0.2em] hover:bg-accent-pink/20 transition disabled:opacity-50 border border-accent-pink/30 neon-glow-pink"
              >
                {creating ? '⏳ CREATING...' : '🏟️ CREATE ARENA ROOM'}
              </button>

              <p className="text-center text-gray-600 text-xs mt-4 font-mono">
                Share the room code with friends — when the host starts, everyone plays <span className="text-accent-pink">{challenge.title}</span>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
