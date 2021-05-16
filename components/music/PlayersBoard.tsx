import { RoomData } from "../../pages/music/room/[roomId]";

export const PlayersBoard: React.FC<PlayersBoardProps> = ({ players = [] }) => {
  return (
    <div className="flex flex-col items-start justify-between h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <div className="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
        <h2 className="mr-auto text-lg font-semibold tracking-wide">
          Jugadores
        </h2>
        <div className="flex flex-row">
          <span className="text-sm text-blue-700 ">
            {players.length} online
          </span>
        </div>
      </div>
      <div className="w-full px-4 py-2 text-gray-800 bg-gray-100 divide-y divide-gray-400">
        {players.map((player, i) => (
          <div
            key={player.id}
            className="flex flex-row items-center justify-between py-4"
          >
            <div className="flex flex-row items-center">
              <img
                src={player.photoURL}
                alt={player.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex ml-4">
                <span className="block font-semibold">
                  {i + 1}. {player.displayName}
                </span>
              </div>
            </div>
            <div className="flex ml-1">
              <span className="block px-3 py-1 text-xs font-extrabold tracking-wide border border-gray-400 rounded-full bg-blue-400 text-white border-transparent whitespace-nowrap">
                {player.score || 0} pts
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="flex justify-center w-full p-4 pb-3 hover:bg-purple-400 hover:text-white text-gray-900">
        <h2 className="text-lg font-semibold tracking-wider subpixel-antialiased">
          Invitar amigos
        </h2>
      </button>
    </div>
  );
};

interface PlayersBoardProps {
  players: RoomData["players"];
}
