import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';

export default function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme, themes } = useTheme();

  return (
    <div className="glass rounded-2xl p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-accent-purple" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Interface Styling</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme.id)}
            className={`group relative p-4 rounded-xl border transition-all overflow-hidden ${
              currentTheme === theme.id 
                ? 'border-accent-purple bg-accent-purple/10' 
                : 'border-white/5 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            {/* Swatches */}
            <div className="flex gap-2 mb-3">
              {theme.colors.map((c, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="text-left">
              <div className={`text-xs font-black tracking-widest uppercase mb-1 ${
                currentTheme === theme.id ? 'text-white' : 'text-gray-500'
              }`}>
                {theme.name}
              </div>
              <div className="text-[10px] font-bold text-gray-700 tracking-wider">
                {theme.id === 'cyberpunk' ? 'ORIGINAL' : 'PREMIUM'}
              </div>
            </div>

            {currentTheme === theme.id && (
              <motion.div 
                layoutId="active-check"
                className="absolute top-3 right-3 text-accent-purple"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}

            {/* Subtle Gradient Overlay */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
            />
          </button>
        ))}
      </div>
      
      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-6">
        ✨ Style settings are synced to your browser for the ultimate experience.
      </p>
    </div>
  );
}
