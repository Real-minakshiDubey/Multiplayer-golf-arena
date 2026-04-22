export default function CharCounter({ count, bestKnown }) {
  const percentage = bestKnown ? Math.min(100, (count / bestKnown) * 100) : 100;

  const getColor = () => {
    if (!bestKnown) return 'bg-gray-500';
    if (count <= bestKnown) return 'bg-golf-400';
    if (count <= bestKnown * 1.5) return 'bg-accent-yellow';
    return 'bg-accent-pink';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Characters (no whitespace)</span>
        <span className="font-mono font-bold text-lg text-golf-400">{count}</span>
      </div>
      <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}