import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname) || isLandingPage;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5 bg-dark-900/90">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-1 text-2xl font-black tracking-wider mono animate-pulse-fast">
          <span className="text-accent-pink animate-glow-pink">BYTE.</span>
          <span className="text-golf-400 animate-glow-cyan">BATTLE</span>
        </Link>

        {/* LINKS — hidden on landing & auth pages */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-[0.2em] text-gray-500">
            <Link to="/problems" className="hover:text-white transition">PROBLEMS</Link>
            <Link to="/leaderboard" className="hover:text-white transition">LEADERBOARD</Link>
            <Link to="/tournaments" className="hover:text-white transition">TOURNAMENTS</Link>
            <Link to="/replays" className="hover:text-white transition">REPLAYS</Link>
            {user?.role === 'admin' && <Link to="/challenges/create" className="text-accent-pink hover:text-white transition">+ BUILDER</Link>}
          </div>
        )}

        {/* Landing page — always show Login + Enter Arena only */}
        {isLandingPage && (
          <div className="flex gap-4 items-center">
            {user ? (
              <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-white transition font-mono text-sm uppercase">LOGOUT</button>
            ) : (
              <Link to="/login" className="text-gray-400 hover:text-white transition font-mono text-sm uppercase">LOGIN</Link>
            )}
            <Link to={user ? "/lobby" : "/login"} className="px-5 py-2 border border-accent-pink/50 text-accent-pink hover:bg-accent-pink/10 transition font-bold tracking-widest text-sm neon-glow-pink rounded-sm uppercase">
              ENTER ARENA
            </Link>
          </div>
        )}

        {/* ACTIONS — hidden on auth & landing pages */}
        {!isAuthPage && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition text-xs font-mono">
                  <span>{user.avatar}</span>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.username.toUpperCase()}</span>
                    {user.role === 'admin' && <span className="text-[8px] text-accent-purple font-black tracking-widest leading-none">ARCHITECT</span>}
                  </div>
                  <span className={`w-2 h-2 rounded-full ${connected ? 'bg-golf-400 glow-cyan' : 'bg-red-500'}`}></span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="text-gray-500 hover:text-accent-pink transition text-xs font-mono">
                  LOGOUT
                </button>
                <Link to={user.role === 'admin' ? "/challenges/create" : "/lobby"} className="px-5 py-2 border border-accent-pink/50 text-accent-pink hover:bg-accent-pink/10 transition font-bold tracking-widest text-sm neon-glow-pink rounded-sm">
                  {user.role === 'admin' ? "BUILDER" : "ENTER ARENA"}
                </Link>
              </>
            ) : (
              <div className="flex gap-4 items-center">
                <Link to="/login" className="text-gray-400 hover:text-white transition font-mono text-sm">LOGIN</Link>
                <Link to="/register" className="px-5 py-2 border border-accent-pink/50 text-accent-pink hover:bg-accent-pink/10 transition font-bold tracking-widest text-sm neon-glow-pink rounded-sm">
                  ENTER ARENA
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}