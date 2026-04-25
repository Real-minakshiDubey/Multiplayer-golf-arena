import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  
  const features = [
    { icon: '⚡', title: 'REAL-TIME EXECUTIONS', desc: 'Compete head-to-head with live sub-millisecond leaderboard updates.' },
    { icon: '🌍', title: '10+ LANGUAGES', desc: 'JavaScript, Python, Rust, Go, Ruby, C, C++ and more.' },
    { icon: '📏', title: 'BYTE-LEVEL PRECISION', desc: 'Write the most concise solution to win the round.' },
    { icon: '🔄', title: 'MATCH REPLAYS', desc: 'Study winning solutions byte-by-byte after every game.' },
    { icon: '📊', title: 'GLOBAL ELO', desc: 'Climb the global leaderboard with every win and dominate.' },
    { icon: '🎮', title: 'SPEED RUNS', desc: '5-minute rounds — perfect for intense focus sessions.' }
  ];

  return (
    <div className="w-full text-center">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-24 pb-12 w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-golf-400 w-16 opacity-50"></div>
          <span className="text-golf-400 font-mono text-xs md:text-sm tracking-[0.3em] font-bold animate-pulse-fast">
            REAL-TIME COMPETITIVE CODING
          </span>
          <div className="h-px bg-golf-400 w-16 opacity-50"></div>
        </div>

        <h1 className="text-7xl md:text-9xl font-black mb-10 leading-none flex flex-col items-center justify-center">
          <span className="text-gray-300 tracking-wider mb-2">MULTIPLAYER</span>
          <span className="text-accent-pink tracking-widest animate-glow-pink mb-4">BYTE</span>
          <span className="text-golf-400 tracking-widest animate-glow-cyan">BATTLE</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg tracking-wide leading-relaxed">
          Battle live opponents to write the shortest possible code. Every byte counts. One problem, two players, zero mercy.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to={user ? (user.role === 'admin' ? "/challenges/create" : "/lobby") : "/login"}
            className="px-10 py-4 border border-dark-600 hover:border-accent-pink text-gray-400 hover:text-accent-pink transition font-bold tracking-[0.2em] text-sm rounded-sm bg-dark-800/80 backdrop-blur-sm neon-glow-pink hover:bg-accent-pink/10">
            {user?.role === 'admin' ? "MANAGE CHALLENGES" : "FIND A MATCH"}
          </Link>
          <Link to={user ? "/replays" : "/login"}
            className="px-10 py-4 border border-dark-600 hover:border-golf-400 text-gray-400 hover:text-golf-400 transition font-bold tracking-[0.2em] text-sm rounded-sm bg-dark-800/80 backdrop-blur-sm hover:bg-golf-400/10 hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]">
            WATCH LIVE
          </Link>
        </div>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-dark-800/50 border border-dark-600 flex items-center justify-center animate-bounce text-gray-500">
            ↓
          </div>
        </div>
      </motion.div>

      {/* Abstract Cityscape Visual (Pure CSS) */}
      <div className="h-64 w-full border-b border-dark-600 flex items-end justify-center gap-1 md:gap-3 px-2 mt-4 bg-gradient-to-t from-dark-800/50 to-transparent relative overflow-hidden">
        
        {/* Abstract Buildings */}
        <div className="w-10 h-20 border-t border-l border-r border-accent-purple/30 bg-dark-900 rounded-t-sm opacity-50"></div>
        <div className="w-8 h-32 border border-dark-600 bg-dark-900 rounded-t-sm"></div>
        <div className="w-16 h-48 border border-golf-400/60 bg-dark-900 rounded-t-sm shadow-[0_-5px_15px_rgba(0,255,204,0.1)] flex flex-col items-center pt-4">
          <div className="w-6 h-1 bg-golf-400/50 rounded-full"></div>
        </div>
        <div className="w-24 h-56 border border-accent-pink/60 bg-dark-900 rounded-t-sm shadow-[0_-5px_15px_rgba(255,0,85,0.15)] flex flex-wrap gap-2 p-3 justify-center">
          <div className="w-2 h-2 bg-accent-pink rounded-sm animate-pulse"></div>
          <div className="w-2 h-2 bg-dark-600 rounded-sm"></div>
          <div className="w-2 h-2 bg-accent-pink rounded-sm opacity-50"></div>
        </div>
        <div className="w-20 h-60 border border-dark-500 bg-dark-900 rounded-t-sm"></div>
        <div className="w-24 h-64 border-2 border-golf-400 bg-dark-900 rounded-t-sm shadow-[0_0_20px_rgba(0,255,204,0.2)] flex flex-wrap content-start gap-2 p-4">
          <div className="w-3 h-3 bg-golf-400 rounded-[1px]"></div>
          <div className="w-3 h-3 bg-accent-pink rounded-[1px] animate-pulse"></div>
          <div className="w-3 h-3 bg-golf-400 rounded-[1px] opacity-40"></div>
          <div className="w-3 h-3 bg-golf-400 rounded-[1px]"></div>
        </div>
        <div className="w-16 h-48 border border-accent-pink/80 bg-dark-900 rounded-t-sm shadow-[0_-5px_10px_rgba(255,0,85,0.1)] flex gap-1 justify-center pt-6">
          <div className="w-1 h-1 bg-accent-pink rounded-full"></div>
          <div className="w-1 h-1 bg-golf-400 rounded-full"></div>
        </div>
        <div className="w-14 h-32 border border-accent-purple/50 bg-dark-900 rounded-t-sm"></div>
        <div className="w-10 h-40 border border-golf-400/30 bg-dark-900 rounded-t-sm"></div>
        <div className="w-12 h-24 border border-dark-600 bg-dark-900 rounded-t-sm"></div>

        {/* Flying car / particle */}
        <motion.div 
          animate={{ x: [0, 800], y: [0, -20, 10, -10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute left-10 top-20 w-8 h-2 bg-golf-400/80 rounded-full blur-[1px] shadow-[0_0_10px_rgba(0,255,204,0.8)]"
        />
      </div>

      {/* Ticker Tape Marquee */}
      <div className="w-full bg-accent-pink py-2 overflow-hidden border-y border-accent-pink/50 relative shadow-[0_0_20px_rgba(255,0,85,0.2)]">
        <div className="whitespace-nowrap animate-marquee inline-flex font-mono font-bold text-dark-900 text-sm md:text-base tracking-[0.2em]">
          <span className="px-8">NEW RECORD: "Palindrome" - 14B (Python) ///</span>
          <span className="px-8 flex items-center gap-2">TOURNAMENT: Pi Day Challenge Starts in 24h <span className="w-2 h-2 rounded-full bg-dark-900 animate-pulse"></span> ///</span>
          <span className="px-8">USER: 'byte_me' reached Grandmaster ///</span>
          
          <span className="px-8">NEW RECORD: "Palindrome" - 14B (Python) ///</span>
          <span className="px-8 flex items-center gap-2">TOURNAMENT: Pi Day Challenge Starts in 24h <span className="w-2 h-2 rounded-full bg-dark-900 animate-pulse"></span> ///</span>
          <span className="px-8">USER: 'byte_me' reached Grandmaster ///</span>
        </div>
      </div>

      {/* Built For The Obsessed Section */}
      <div className="max-w-6xl mx-auto px-4 py-32">
        <p className="text-accent-pink font-mono tracking-[0.5em] text-sm font-bold mb-6">
          // CORE FEATURES
        </p>
        <h2 className="text-4xl md:text-7xl font-black mb-20 flex flex-wrap justify-center items-center gap-x-4">
          <span className="text-gray-300">BUILT FOR THE</span>
          <span className="text-accent-pink animate-glow-pink">OBSESSED</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="bg-dark-800/40 border border-dark-600 rounded-sm p-8 hover:border-golf-400/50 transition group hover:shadow-[0_0_20px_rgba(0,255,204,0.1)]"
            >
              <div className="text-3xl mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition">{f.icon}</div>
              <h3 className="font-bold text-lg mb-4 text-white tracking-widest font-mono text-sm">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-mono">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}