import { useEffect, useState } from "react";
import { RoomData, Category } from "../../pages/music/room/[roomId]";
import { GameBoard } from "./GameBoard";
import { PlayedSongs } from "./PlayedSongs";
import { PlayersBoard } from "./PlayersBoard";

const Room: React.FC<RoomProps> = ({ data, categories }) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="order-2 w-full mt-3 md:order-1 md:w-3/12 md:mt-0">
        <PlayedSongs songs={data?.playedSongs} />
      </div>
      <div className="order-first w-full mx-0 md:order-2 md:w-1/2 md:mx-5">
        <GameBoard roomData={data} categories={categories} />
      </div>
      <div className="order-1 w-full mt-3 md:order-3 md:w-3/12 md:mt-0">
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
