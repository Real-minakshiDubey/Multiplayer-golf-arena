import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, TrendingUp, Mail, Shield, Award, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subValue, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-2xl border border-white/5"
  >
    <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 text-${color}`} />
    </div>
    <div className="text-3xl font-black text-white mb-1 font-mono">{value}</div>
    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
    {subValue && <div className="mt-2 text-[10px] font-bold text-gray-600">{subValue}</div>}
  </motion.div>
);

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const winRate = user.games_played > 0
    ? Math.round((user.games_won / user.games_played) * 100)
    : 0;

  // Mock progress to next level
  const nextMilestone = Math.ceil((user.elo + 1) / 500) * 500;
  const progress = ((user.elo % 500) / 500) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 bg-mesh min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 lg:p-12 border border-white/10 mb-8 relative overflow-hidden"
      >
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-golf-400/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-pink/10 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-dark-950 border-4 border-white/5 flex items-center justify-center text-7xl md:text-8xl shadow-2xl relative z-10">
              {user.avatar}
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-golf-400/30 rounded-full"
            />
            <div className="absolute -bottom-2 -right-2 bg-golf-400 text-dark-950 px-3 py-1 rounded-full text-xs font-black tracking-tighter shadow-lg z-20">
              PRO
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {user.username}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  RANK #{user.elo >= 1500 ? 'ELITE' : 'CHALLENGER'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 font-medium mb-8">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-golf-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent-purple" />
                Verified Player
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-pink" />
                Joined {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Elo Progress */}
            <div className="max-w-md mx-auto md:mx-0">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-golf-400" />
                  <span className="font-mono font-black text-2xl text-white">{user.elo}</span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">ELO</span>
                </div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  Next Rank: {nextMilestone}
                </div>
              </div>
              <div className="h-2 w-full bg-dark-950 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-golf-400 via-accent-cyan to-accent-purple"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Trophy} 
          label="Total Wins" 
          value={user.games_won} 
          subValue="TOP 5% OF PLAYERS"
          color="yellow-400"
          delay={0.1}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Win Rate" 
          value={`${winRate}%`} 
          subValue={`${user.games_played} MATCHES TOTAL`}
          color="green-400"
          delay={0.2}
        />
        <StatCard 
          icon={Award} 
          label="Achievements" 
          value="12" 
          subValue="4 LEGENDARY BADGES"
          color="purple-500"
          delay={0.3}
        />
        <StatCard 
          icon={Target} 
          label="Avg. Accuracy" 
          value="94%" 
          subValue="BASED ON TEST CASES"
          color="blue-400"
          delay={0.4}
        />
      </div>

      {/* Placeholder for Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-8 border border-white/5 text-center py-20"
      >
        <Trophy className="w-12 h-12 text-gray-800 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-600 mb-2">Recent Match History</h3>
        <p className="text-gray-700 font-medium">Coming soon: Replay your past matches and track your byte-saving progress!</p>
      </motion.div>
    </div>
  );
}