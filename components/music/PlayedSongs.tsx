import { FaRegShareSquare } from "react-icons/fa";
import { RoomData } from "../../pages/music/room/[roomId]";
import RoundedButton from "../RoundedButton";

export const PlayedSongs: React.FC<PlayedSongsProps> = ({ songs = [] }) => {
  return (
    <div className="flex flex-col items-start justify-between h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <div className="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
        <h2 className="mr-auto text-lg font-semibold tracking-wide">
          Canciones
        </h2>
        <div className="flex flex-row">
          <span className="text-sm text-blue-700 ">
            {songs.length} escuchadas
          </span>
        </div>
      </div>
      <div className="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400">
        {songs.length === 0 ? (
          <div className="flex justify-center py-4">
            Empezá a jugar para ver canciones
          </div>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              className="flex flex-row items-center py-4 justify-between"
            >
              <div className="flex flex-row items-center">
                <img
                  src={song.image}
                  alt="user-1"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <span className="block font-semibold">{song.name}</span>
                  <span className="block font-light">{song.artist.name}</span>
                </div>
              </div>
              <RoundedButton
                id="share-whatsapp"
                Icon={FaRegShareSquare}
                iconBgColor="bg-purple-400"
                size={10}
                onClick={() => null}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface PlayedSongsProps {
  songs: RoomData["playedSongs"];
}
