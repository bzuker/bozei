import React from "react";
import { FaRegShareSquare } from "react-icons/fa";
import Layout from "../../components/layout";
import RoundedButton from "../../components/RoundedButton";

export const PlayedSongs: React.FC<PlayedSongsProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col items-start justify-between h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <div className="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
        <h2 className="mr-auto text-lg font-semibold tracking-wide">
          Canciones
        </h2>
        <div className="flex flex-row">
          <span className="text-sm text-blue-700 ">2 escuchadas</span>
        </div>
      </div>
      <div className="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400">
        <div className="flex flex-row items-center justify-between py-4">
          <div className="flex flex-row items-center">
            <img
              src="https://uifaces.co/our-content/donated/BMGfa1yq.png"
              alt="user-1"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-sm ml-3">
              <span className="block font-semibold">Deltondo Matthew</span>
              <span className="block text-xs font-light text-gray-700">
                8 mutual friends
              </span>
            </div>
          </div>
          <RoundedButton
            id="share-whatsapp"
            Icon={FaRegShareSquare}
            iconBgColor="bg-purple-400"
            size={10}
            onClick={() =>
              window.open(`https://api.whatsapp.com/send?text=${value}`)
            }
          />
        </div>
        <div className="flex flex-row items-center justify-between py-4">
          <img
            src="https://uifaces.co/our-content/donated/AVQ0V28X.jpg"
            alt="user-1"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <span className="block font-semibold">Adriana Cardoson</span>
            <span className="block text-xs font-light text-gray-700">
              6 mutual friends
            </span>
          </div>
          <a
            href="#"
            className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            follow
          </a>
        </div>
        <div className="flex flex-row items-center justify-between pt-4">
          <img
            src="https://uifaces.co/our-content/donated/UZ0VIIh3.png"
            alt="user-1"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <span className="block font-semibold">Daniela Moreauno</span>
            <span className="block text-xs font-light text-gray-700">
              2 mutual friends
            </span>
          </div>
          <a
            href="#"
            className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            follow
          </a>
        </div>
      </div>
    </div>
  );
};

interface PlayedSongsProps {}

export const PlayersBoard: React.FC<PlayersBoardProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col items-start justify-between h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <div className="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
        <h2 className="mr-auto text-lg font-semibold tracking-wide">
          Jugadores
        </h2>
        <div className="flex flex-row">
          <span className="text-sm text-blue-700 ">1 online</span>
        </div>
      </div>
      <div className="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400">
        <div className="flex flex-row items-center justify-between py-4">
          <img
            src="https://uifaces.co/our-content/donated/BMGfa1yq.png"
            alt="user-1"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <span className="block font-semibold">Deltondo Matthew</span>
            <span className="block text-xs font-light text-gray-700">
              8 mutual friends
            </span>
          </div>
          <a
            href="#"
            className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            follow
          </a>
        </div>
        <div className="flex flex-row items-center justify-between py-4">
          <img
            src="https://uifaces.co/our-content/donated/AVQ0V28X.jpg"
            alt="user-1"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <span className="block font-semibold">Adriana Cardoson</span>
            <span className="block text-xs font-light text-gray-700">
              6 mutual friends
            </span>
          </div>
          <a
            href="#"
            className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            follow
          </a>
        </div>
        <div className="flex flex-row items-center justify-between pt-4">
          <img
            src="https://uifaces.co/our-content/donated/UZ0VIIh3.png"
            alt="user-1"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-sm">
            <span className="block font-semibold">Daniela Moreauno</span>
            <span className="block text-xs font-light text-gray-700">
              2 mutual friends
            </span>
          </div>
          <a
            href="#"
            className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-blue-500 hover:text-white hover:border-transparent"
          >
            follow
          </a>
        </div>
      </div>
      <button className="flex justify-center w-full p-4 pb-3 hover:bg-purple-400 hover:text-white">
        <h2 className="text-lg font-semibold tracking-wide">Invitar amigos</h2>
      </button>
    </div>
  );
};

interface PlayersBoardProps {}

export const GameBoard: React.FC<GameBoardProps> = ({ ...props }) => {
  return <div></div>;
};

interface GameBoardProps {}

export const Room: React.FC<RoomProps> = ({ ...props }) => {
  return (
    <Layout>
      <div className="flex">
        <div className="w-3/12">
          <PlayedSongs />
        </div>
        <div className="w-1/2 mx-5">b</div>
        <div className="w-3/12">
          <PlayersBoard />
        </div>
      </div>
    </Layout>
  );
};

interface RoomProps {}

export default Room;
