import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 3) return toast.error('Username must be 3+ characters');
    if (password.length < 6) return toast.error('Password must be 6+ characters');

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success('Account created! Let\'s golf! ⛳');
      navigate('/lobby');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Join the Arena</h2>
        <p className="text-gray-400 text-center mb-8">Create your golfer profile</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900 rounded-lg border border-white/10 focus:border-golf-400 outline-none transition"
              placeholder="code_ninja" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900 rounded-lg border border-white/10 focus:border-golf-400 outline-none transition"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900 rounded-lg border border-white/10 focus:border-golf-400 outline-none transition"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-golf-400 text-dark-900 rounded-xl font-bold text-lg hover:bg-golf-500 transition disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-golf-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}