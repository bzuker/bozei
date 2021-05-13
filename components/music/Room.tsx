import { useEffect, useState } from "react";
import { RoomData, Category } from "../../pages/music/room/[roomId]";
import { GameBoard } from "./GameBoard";
import { PlayedSongs } from "./PlayedSongs";
import { PlayersBoard } from "./PlayersBoard";

const Room: React.FC<RoomProps> = ({ data, categories }) => {
  return (
    <div className="flex">
      <div className="w-3/12">
        <PlayedSongs songs={data?.playedSongs} />
      </div>
      <div className="w-1/2 mx-5">
        <GameBoard roomData={data} categories={categories} />
      </div>
      <div className="w-3/12">
        <PlayersBoard players={data?.players} />
      </div>
    </div>
  );
};

export interface RoomProps {
  data: RoomData;
  categories: Category[];
}

export default Room;
