export default function ChallengePanel({ challenge }) {
  if (!challenge) return null;

  const diffColor = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10'
  };

  return (
    <div className="glass rounded-xl p-5 space-y-4 h-full overflow-auto">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">{challenge.title}</h2>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${diffColor[challenge.difficulty]}`}>
          {challenge.difficulty.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-300 leading-relaxed">{challenge.description}</p>

      {challenge.inputFormat && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-1">Input Format</h4>
          <p className="text-sm text-gray-300">{challenge.inputFormat}</p>
        </div>
      )}

      {challenge.outputFormat && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-1">Output Format</h4>
          <p className="text-sm text-gray-300">{challenge.outputFormat}</p>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Examples</h4>
        {challenge.examples?.map((ex, i) => (
          <div key={i} className="bg-dark-900 rounded-lg p-3 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-500 text-sm w-12">Input:</span>
              <code className="text-golf-400 text-sm font-mono">{ex.input}</code>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 text-sm w-12">Output:</span>
              <code className="text-accent-yellow text-sm font-mono">{ex.output}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}