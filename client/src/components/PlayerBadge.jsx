export default function PlayerBadge({ player, isHost }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg
      ${player.ready ? 'bg-golf-400/10 border border-golf-400/30' : 'bg-dark-900'}`}>
      <span className="text-xl">{player.avatar}</span>
      <span className="font-medium text-sm">{player.username}</span>
      {isHost && <span className="text-xs bg-accent-yellow/20 text-accent-yellow px-1.5 py-0.5 rounded">HOST</span>}
      {player.ready && <span className="text-golf-400 text-xs">✓ Ready</span>}
    </div>
  );
}