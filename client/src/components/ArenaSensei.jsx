import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Brain, Scroll, Zap, Quote } from 'lucide-react';

export default function ArenaSensei({ isOpen, onClose, analysis, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-accent-purple/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-purple/20 border border-accent-purple/30">
                <Brain className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Arena Sensei</h2>
                <div className="text-[10px] font-bold text-accent-purple tracking-[0.2em] uppercase">Ancient Code Wisdom</div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-2 border-accent-purple animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent-purple animate-pulse" />
                </div>
                <p className="text-gray-500 font-mono text-sm animate-pulse">The Sensei is meditating on your logic...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Explanation */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-4 h-4 text-gray-600" />
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Observations</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {analysis?.explanation}
                  </p>
                </section>

                {/* Golf Tip */}
                <section className="bg-accent-purple/5 rounded-2xl p-6 border border-accent-purple/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-accent-purple" />
                    <h3 className="text-xs font-black text-accent-purple uppercase tracking-widest">Golfing Technique</h3>
                  </div>
                  <p className="text-gray-400 font-mono text-sm italic">
                    "{analysis?.golfedTip}"
                  </p>
                </section>

                {/* Sensei Code */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Scroll className="w-4 h-4 text-accent-cyan" />
                    <h3 className="text-xs font-black text-accent-cyan uppercase tracking-widest">The Sensei's Scroll</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-cyan/5 blur-xl rounded-full" />
                    <pre className="relative p-6 glass rounded-2xl border border-white/5 font-mono text-sm text-accent-cyan overflow-x-auto">
                      <code>{analysis?.senseiCode}</code>
                    </pre>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-white/[0.02] text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              ✨ Every byte saved is a step closer to enlightenment.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
