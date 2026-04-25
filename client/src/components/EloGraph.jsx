import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function EloGraph({ history = [] }) {
  const { themes, currentTheme } = useTheme();
  
  // Find current theme primary color for the graph
  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];
  const primaryColor = activeTheme.colors[0];

  const data = history.map((h, i) => ({
    name: i + 1,
    elo: h.elo,
    date: new Date(h.timestamp).toLocaleDateString()
  }));

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center glass rounded-xl border border-white/5">
        <p className="text-gray-500 font-mono text-sm">No match history yet. Win some games to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full glass rounded-xl border border-white/5 p-4 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(16, 16, 24, 0.9)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: primaryColor }}
          />
          <Area 
            type="monotone" 
            dataKey="elo" 
            stroke={primaryColor} 
            fillOpacity={1} 
            fill="url(#colorElo)" 
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
