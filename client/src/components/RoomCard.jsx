import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

export default function RoomCard({ room }) {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const handleJoin = () => {
    socket?.emit('join-room', { roomCode: room.code }, (response) => {
      if (response.success) {
        navigate(`/room/${room.code}`);
      }
    });
  };

  return (
    <div className="glass rounded-xl p-5 hover:border-golf-400/30 transition-all group cursor-pointer" onClick={handleJoin}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg group-hover:text-golf-400 transition">{room.name}</h3>
        <span className="px-2 py-1 bg-golf-400/10 text-golf-400 text-xs rounded-md font-mono">
          {room.code}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>👥 {room.players?.length || '?'}/{room.max_players || room.maxPlayers}</span>
        <span>⏱️ {Math.floor((room.round_time || room.roundTime) / 60)}min</span>
        <span className={`px-2 py-0.5 rounded text-xs ${
          room.status === 'waiting' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
        }`}>
          {room.status}
        </span>
      </div>
    </div>
  );
}