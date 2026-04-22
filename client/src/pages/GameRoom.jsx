import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import ChallengePanel from '../components/ChallengePanel';
import LiveLeaderboard from '../components/LiveLeaderboard';
import Timer from '../components/Timer';
import CharCounter from '../components/CharCounter';
import PlayerBadge from '../components/PlayerBadge';
import ResultsModal from '../components/ResultsModal';
import { LANGUAGES, STARTER_CODE } from '../utils/constants';
import toast from 'react-hot-toast';

export default function GameRoom() {
  const { roomCode } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting | playing | finished
  const [challenge, setChallenge] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE['python']);
  const [charCount, setCharCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [results, setResults] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Try to join if not already in
    socket.emit('join-room', { roomCode }, (response) => {
      if (response.success) {
        setRoom(response.room);
      } else {
        toast.error(response.error);
        navigate('/lobby');
      }
    });

    // Socket listeners
    socket.on('player-joined', ({ players }) => {
      setRoom(prev => prev ? { ...prev, players } : prev);
      toast('👤 Player joined!', { icon: '🏌️' });
    });

    socket.on('player-left', ({ players }) => {
      setRoom(prev => prev ? { ...prev, players } : prev);
    });

    socket.on('player-updated', ({ players }) => {
      setRoom(prev => prev ? { ...prev, players } : prev);
    });

    socket.on('game-started', ({ challenge: ch, roundTime, startTime }) => {
      setChallenge(ch);
      setGameState('playing');
      setEndTime(startTime + roundTime * 1000);
      setLeaderboard([]);
      setTestResults(null);
      toast('🎮 Game started! Write the shortest code!', { duration: 3000 });
    });

    socket.on('submission-result', ({ passed, charCount: cc, results: r }) => {
      setSubmitting(false);
      setTestResults(r);
      if (passed) {
        toast.success(`✅ All tests passed! ${cc} characters`);
      } else {
        const failCount = r.filter(t => !t.passed).length;
        toast.error(`❌ ${failCount} test(s) failed`);
      }
    });

    socket.on('leaderboard-update', ({ leaderboard: lb }) => {
      setLeaderboard(lb);
    });

    socket.on('player-solved', ({ username, charCount: cc }) => {
      toast(`⚡ ${username} solved it in ${cc} chars!`, { icon: '🏌️' });
    });

    socket.on('player-submitting', ({ username }) => {
      // subtle notification
    });

    socket.on('game-ended', (data) => {
      setGameState('finished');
      setResults(data);
    });

    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('player-updated');
      socket.off('game-started');
      socket.off('submission-result');
      socket.off('leaderboard-update');
      socket.off('player-solved');
      socket.off('player-submitting');
      socket.off('game-ended');
    };
  }, [socket, roomCode]);

  // Update char count
  useEffect(() => {
    setCharCount(code.replace(/\s/g, '').length);
  }, [code]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang] || '');
  };

  const handleRun = () => {
    if (!socket || running) return;
    setRunning(true);
    socket.emit('run-code', { roomCode, code, language }, (response) => {
      setRunning(false);
      setTestResults(response.results);
      if (response.allPassed) {
        toast.success(`Examples pass! ${response.charCount} chars`);
      } else {
        toast.error('Some examples failed');
      }
    });
  };

  const handleSubmit = () => {
    if (!socket || submitting) return;
    setSubmitting(true);
    socket.emit('submit-code', { roomCode, code, language });
  };

  const handleReady = () => {
    socket?.emit('toggle-ready', { roomCode });
  };

  const handleStart = () => {
    socket?.emit('start-game', { roomCode });
  };

  const handleLeave = () => {
    socket?.emit('leave-room', { roomCode });
    navigate('/lobby');
  };

  const isHost = room?.host?.id === user?.id;

  // WAITING STATE
  if (gameState === 'waiting') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{room?.name || 'Game Room'}</h2>
              <p className="text-gray-400 font-mono text-sm mt-1">Code: {roomCode}</p>
            </div>
            <button onClick={handleLeave} className="px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">
              Leave Room
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-400 mb-3">Players ({room?.players?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {room?.players?.map(p => (
                <PlayerBadge key={p.id} player={p} isHost={p.id === room?.host?.id} />
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Share this code with friends:</p>
            <p className="text-3xl font-mono font-bold text-golf-400 tracking-wider">{roomCode}</p>
          </div>

          <div className="flex gap-3">
            {isHost ? (
              <button onClick={handleStart}
                className="flex-1 py-3 bg-golf-400 text-dark-900 rounded-xl font-bold text-lg hover:bg-golf-500 transition">
                🚀 Start Game
              </button>
            ) : (
              <button onClick={handleReady}
                className="flex-1 py-3 bg-accent-purple text-white rounded-xl font-bold text-lg hover:bg-purple-600 transition">
                {room?.players?.find(p => p.id === user?.id)?.ready ? '❌ Unready' : '✅ Ready Up'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PLAYING STATE
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          ⛳ {room?.name} <span className="text-gray-500 text-sm font-mono ml-2">{roomCode}</span>
        </h2>
        {endTime && <Timer endTime={endTime} onTimeUp={() => {}} />}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Challenge Panel */}
        <div className="lg:col-span-3">
          <ChallengePanel challenge={challenge} />
        </div>

        {/* Editor */}
        <div className="lg:col-span-6 space-y-3">
          {/* Language Select */}
          <div className="flex items-center gap-2 flex-wrap">
            {LANGUAGES.map(lang => (
              <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${language === lang.id
                    ? 'bg-golf-400/20 text-golf-400 border border-golf-400/30'
                    : 'bg-dark-700 text-gray-400 hover:text-white'}`}>
                {lang.icon} {lang.name}
              </button>
            ))}
          </div>

          <CodeEditor language={language} value={code} onChange={setCode} />

          <CharCounter count={charCount} />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handleRun} disabled={running}
              className="flex-1 py-3 bg-dark-600 text-white rounded-xl font-semibold hover:bg-dark-700 transition disabled:opacity-50">
              {running ? '⏳ Running...' : '▶️ Run (Examples)'}
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-3 bg-golf-400 text-dark-900 rounded-xl font-bold hover:bg-golf-500 transition disabled:opacity-50 glow-green">
              {submitting ? '⏳ Judging...' : '🚀 Submit'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="glass rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-sm text-gray-400">Test Results</h4>
              {testResults.map((t, i) => (
                <div key={i} className={`flex items-start gap-2 text-sm p-2 rounded ${t.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
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

        {/* Leaderboard */}
        <div className="lg:col-span-3">
          <LiveLeaderboard leaderboard={leaderboard} currentUserId={user?.id} />
        </div>
      </div>

      {/* Results Modal */}
      {results && (
        <ResultsModal results={results} currentUserId={user?.id}
          onClose={() => { setResults(null); navigate('/lobby'); }} />
      )}
    </div>
  );
}