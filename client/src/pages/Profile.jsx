import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, TrendingUp, Mail, Shield, Award, Clock, Code, Users, Settings, Database, Server } from 'lucide-react';
import api from '../utils/api';
import ThemeSwitcher from '../components/ThemeSwitcher';
import EloGraph from '../components/EloGraph';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, subValue, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}/10 rounded-full blur-2xl group-hover:bg-${color}/20 transition-all duration-500`}></div>
    <div className="relative flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-${color}/10 border border-${color}/20`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{subValue}</div>
      </div>
    </div>
  </motion.div>
);

export default function Profile() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState({ challenges: 0, users: 0 });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      api.get('/challenges').then(res => {
        setAdminStats(prev => ({ ...prev, challenges: res.data.length }));
      });
    }
  }, [isAdmin]);

  if (!user) return null;

  const progress = (user.elo % 100);
  const nextMilestone = Math.ceil(user.elo / 100) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-mesh min-h-screen">
      {/* Hero Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 lg:p-12 border border-white/5 mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-purple/10 to-transparent pointer-events-none"></div>
        
        <div className="relative flex flex-col lg:flex-row gap-10 items-center">
          {/* Avatar & Main Info */}
          <div className="flex flex-col items-center text-center lg:text-left lg:items-start">
            <div className="text-8xl mb-6 filter drop-shadow-2xl animate-float">{user.avatar}</div>
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{user.username}</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                  isAdmin ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple' : 'bg-golf-400/10 border-golf-400/30 text-golf-400'
                }`}>
                  {isAdmin ? 'System Architect' : 'Pro Player'}
                </span>
              </div>
              <p className="text-gray-500 font-medium font-mono text-sm mb-6 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                    <Shield className="w-4 h-4 text-accent-purple" />
                    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-widest">Admin Access Level 10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex-1 w-full max-w-md lg:ml-auto">
            <div className="glass rounded-2xl p-6 border border-white/5 shadow-inner">
              {isAdmin ? (
                <div className="py-4 text-center">
                  <div className="text-accent-purple mb-2"><Server className="w-8 h-8 mx-auto opacity-50" /></div>
                  <span className="text-xs font-black text-accent-purple tracking-widest uppercase">Arena Management Dashboard</span>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin ? (
          <>
            <StatCard 
              icon={Code} 
              label="Challenges" 
              value={adminStats.challenges} 
              subValue="TOTAL IN REPOSITORY"
              color="purple-400"
              delay={0.1}
            />
            <StatCard 
              icon={Users} 
              label="Users Managed" 
              value="ACTIVE" 
              subValue="GLOBAL ARENA ACCESS"
              color="blue-400"
              delay={0.2}
            />
            <StatCard 
              icon={Database} 
              label="System Node" 
              value="STABLE" 
              subValue="MONGODB ATLAS CLOUD"
              color="green-400"
              delay={0.3}
            />
            <StatCard 
              icon={Shield} 
              label="Security" 
              value="ENCRYPTED" 
              subValue="JWT AUTH ENABLED"
              color="red-400"
              delay={0.4}
            />
          </>
        ) : (
          <>
            <StatCard 
              icon={Zap} 
              label="Games Played" 
              value={user.games_played} 
              subValue="ALL TIME RECORD"
              color="golf-400"
              delay={0.1}
            />
            <StatCard 
              icon={Trophy} 
              label="Games Won" 
              value={user.games_won} 
              subValue="COMPETITIVE ARENA"
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
          </>
        )}
      </div>
      
      {/* Performance Graph Section */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-accent-primary" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Elo Performance Trend</h2>
          </div>
          <EloGraph history={user?.elo_history || []} />
        </motion.div>
      )}

      {/* Admin Specific Action Center or Player History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-8 border border-white/5 text-center py-20"
      >
        {isAdmin ? (
          <>
            <Settings className="w-12 h-12 text-accent-purple/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Admin Control Center</h3>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-10">
              As a System Architect, you have full control over challenge creation, user roles, and arena stability.
            </p>
            <div className="max-w-md mx-auto">
              <ThemeSwitcher />
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start text-left">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-500" />
                Recent Match History
              </h3>
              <div className="glass rounded-xl p-8 border border-white/5 text-center">
                <p className="text-gray-700 font-medium">Coming soon: Replay your past matches and track your byte-saving progress!</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                Personalization
              </h3>
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}