import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Code, Info, Zap, Layout, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CreateChallenge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: 'strings',
    inputFormat: '',
    outputFormat: '',
    examples: [{ input: '', output: '' }],
    testCases: [{ input: '', expected: '' }]
  });

  const handleAddField = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], type === 'examples' ? { input: '', output: '' } : { input: '', expected: '' }]
    }));
  };

  const handleRemoveField = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleFieldChange = (type, index, field, value) => {
    const newList = [...formData[type]];
    newList[index][field] = value;
    setFormData(prev => ({ ...prev, [type]: newList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/challenges', formData);
      toast.success('Challenge created successfully!');
      navigate('/problems');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-mesh min-h-screen">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-6 w-fit"
        >
          <Code className="w-4 h-4 text-accent-purple" />
          <span className="text-xs font-bold tracking-widest text-accent-purple uppercase">Architect Mode</span>
        </motion.div>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
          Challenge <span className="text-gradient-golf">Builder</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-xl">
          Craft a new trial for the arena. Define the problem, set the constraints, and prepare the test cases.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border border-white/5 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-golf-400" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Core Definition</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Reverse Fibonacci"
                className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-golf-400 transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-golf-400 transition-all font-bold"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <input 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Strings"
                  className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-golf-400 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Clearly explain the goal and any constraints..."
              className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-golf-400 transition-all font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Input Format</label>
              <input 
                value={formData.inputFormat}
                onChange={e => setFormData({ ...formData, inputFormat: e.target.value })}
                placeholder="e.g., A JSON array via stdin"
                className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-3 px-6 text-white focus:outline-none focus:border-golf-400 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Output Format</label>
              <input 
                value={formData.outputFormat}
                onChange={e => setFormData({ ...formData, outputFormat: e.target.value })}
                placeholder="e.g., Print the result as integer"
                className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-3 px-6 text-white focus:outline-none focus:border-golf-400 transition-all text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Examples Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 border border-white/5 space-y-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-accent-pink" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Public Examples</h2>
            </div>
            <button 
              type="button"
              onClick={() => handleAddField('examples')}
              className="flex items-center gap-1 text-[10px] font-black text-accent-pink hover:text-white transition uppercase tracking-[0.2em] bg-accent-pink/10 px-3 py-1.5 rounded-full border border-accent-pink/20"
            >
              <Plus className="w-3 h-3" /> Add Example
            </button>
          </div>

          <div className="space-y-4">
            {formData.examples.map((ex, i) => (
              <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5 relative group">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Input"
                      value={ex.input}
                      onChange={e => handleFieldChange('examples', i, 'input', e.target.value)}
                      className="bg-dark-900 border border-white/5 rounded-lg py-3 px-4 text-white text-sm font-mono focus:border-accent-pink outline-none"
                    />
                    <input 
                      placeholder="Output"
                      value={ex.output}
                      onChange={e => handleFieldChange('examples', i, 'output', e.target.value)}
                      className="bg-dark-900 border border-white/5 rounded-lg py-3 px-4 text-white text-sm font-mono focus:border-accent-pink outline-none"
                    />
                  </div>
                </div>
                {formData.examples.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveField('examples', i)}
                    className="p-2 text-gray-700 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Test Cases Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 border border-white/5 space-y-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Hidden Test Cases</h2>
            </div>
            <button 
              type="button"
              onClick={() => handleAddField('testCases')}
              className="flex items-center gap-1 text-[10px] font-black text-yellow-400 hover:text-white transition uppercase tracking-[0.2em] bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20"
            >
              <Plus className="w-3 h-3" /> Add Test Case
            </button>
          </div>

          <div className="space-y-4">
            {formData.testCases.map((tc, i) => (
              <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/5 relative group">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Input Data"
                      value={tc.input}
                      onChange={e => handleFieldChange('testCases', i, 'input', e.target.value)}
                      className="bg-dark-900 border border-white/5 rounded-lg py-3 px-4 text-white text-sm font-mono focus:border-yellow-400 outline-none"
                    />
                    <input 
                      placeholder="Expected Output"
                      value={tc.expected}
                      onChange={e => handleFieldChange('testCases', i, 'expected', e.target.value)}
                      className="bg-dark-900 border border-white/5 rounded-lg py-3 px-4 text-white text-sm font-mono focus:border-yellow-400 outline-none"
                    />
                  </div>
                </div>
                {formData.testCases.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveField('testCases', i)}
                    className="p-2 text-gray-700 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">
            ⚠️ Hidden test cases are never shown to players. They are used exclusively for grading.
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-8"
        >
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-12 py-5 bg-golf-400 text-dark-900 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 animate-spin rounded-full" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                CREATE CHALLENGE
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
