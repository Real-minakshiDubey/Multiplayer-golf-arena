import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roundTime, setRoundTime] = useState(300);
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) { /* ignore */ }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return toast.error('Enter a room name');

    try {
      const res = await api.post('/rooms', { name: roomName, maxPlayers, roundTime });
      const { code } = res.data;

      socket?.emit('create-room', {
        roomCode: code,
        roomName,
        maxPlayers,
        roundTime
      }, (response) => {
        if (response.success) {
          navigate(`/room/${code}`);
        }
      });
    } catch (err) {
      toast.error('Failed to create room');
    }
  };

  const handleJoinByCode = () => {
    if (!joinCode.trim()) return toast.error('Enter a room code');

    socket?.emit('join-room', { roomCode: joinCode.toUpperCase() }, (response) => {
      if (response.success) {
        navigate(`/room/${joinCode.toUpperCase()}`);
      } else {
        toast.error(response.error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🎮 Game Lobby</h1>
          <p className="text-gray-400 mt-1">Join a room or create your own</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-3 bg-golf-400 text-dark-900 rounded-xl font-bold hover:bg-golf-500 transition">
          + Create Room
        </button>
      </div>

      {/* Join by Code */}
      <div className="glass rounded-xl p-4 mb-6 flex gap-3">
        <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
          className="flex-1 px-4 py-2 bg-dark-900 rounded-lg border border-white/10 focus:border-golf-400 outline-none font-mono uppercase"
          placeholder="Enter room code (e.g. GOLF-A1B2)" />
        <button onClick={handleJoinByCode}
          className="px-6 py-2 bg-accent-purple text-white rounded-lg font-semibold hover:bg-purple-600 transition">
          Join
        </button>
      </div>

      {/* Create Room Panel */}
      {showCreate && (
        <div className="glass rounded-xl p-6 mb-6 space-y-4 animate-slide-up">
          <h3 className="font-bold text-lg">Create New Room</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Room Name</label>
              <input value={roomName} onChange={e => setRoomName(e.target.value)}
                className="w-full px-4 py-2 bg-dark-900 rounded-lg border border-white/10 focus:border-golf-400 outline-none"
                placeholder="Epic Golf Battle" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Max Players</label>
              <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))}
                className="w-full px-4 py-2 bg-dark-900 rounded-lg border border-white/10 outline-none">
                {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} players</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Round Time</label>
              <select value={roundTime} onChange={e => setRoundTime(Number(e.target.value))}
                className="w-full px-4 py-2 bg-dark-900 rounded-lg border border-white/10 outline-none">
                <option value={120}>2 minutes</option>
                <option value={180}>3 minutes</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>
          </div>
          <button onClick={createRoom}
            className="px-6 py-3 bg-golf-400 text-dark-900 rounded-xl font-bold hover:bg-golf-500 transition">
            🚀 Create & Join
          </button>
        </div>
      )}

      {/* Room List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-400">
          Open Rooms ({rooms.length})
        </h3>
        {rooms.length === 0 ? (
          <div className="glass rounded-xl p-10 text-center text-gray-500">
            <p className="text-4xl mb-3">🏜️</p>
            <p>No open rooms. Create one and invite friends!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {rooms.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
}