import { Line } from "rc-progress";
import { Input } from "../input";
import MusicSvg from "../MusicSvg";

import {
  useState,
  useEffect,
  Fragment,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { FaCheck, FaChevronDown, FaRegCopy } from "react-icons/fa";
import { BASE_URL } from "../../utils/constants";
import useSWR from "swr";
import {
  Category,
  RoomData,
  RoomSettings,
  RoomStatus,
  Song,
} from "../../pages/music/room/[roomId]";
import fetcher from "../../utils/fetcher";
import RacingFlagSvg from "../svg/RacingFlagSvg";
import { CallType } from "../../models/Room";
import DecisionMakingSvg from "../svg/DecisionMakingSvg";

interface CustomListboxProps<T> {
  label: string;
  options: Array<T>;
  renderOption: (selected: T) => string;
  selected: T;
  setSelected: Dispatch<SetStateAction<T>>;
}

function CustomListbox<T extends { id: string }>({
  label,
  options,
  renderOption,
  selected,
  setSelected,
}: CustomListboxProps<T>) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="mt-4 mb-1 block font-normal text-gray-500">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative h-12 w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:text-base">
              <span className="flex items-center">
                <span className="block truncate">{renderOption(selected)}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaChevronDown
                  className="h-3 w-3 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm md:text-base divide-y divide-gray-200"
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      clsx(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={clsx(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {renderOption(option)}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <FaCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

async function startMusicRoom(roomId: string, settings: RoomSettings) {
  const result = await fetcher(`/api/music/${roomId}`, {
    method: "POST",
    body: JSON.stringify({ type: CallType.START, settings }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result;
}

export const SettingsBoard: React.FC<SettingsBoardProps> = ({
  categories,
  roomId,
  ...props
}) => {
  const [category, setCategory] = useState<typeof categories[0]>(null);
  const [playlist, setPlaylist] = useState(null);
  const [rounds, setRounds] = useState({ id: "10", rounds: 10 });
  const [difficulty, setDifficulty] = useState({
    id: "medium",
    seconds: 5, //TODO CHANGE BACK
    description: "Media (20s)",
  });
  const { data: playlistsOptions = [] } = useSWR<
    { id: string; name: string; imageUrl: string }[]
  >(() => `/api/spotify/playlists?categoryId=${category.id}`);

  const canSubmit = category && playlist;

  return (
    <div className="flex flex-col h-auto bg-white rounded-lg shadow-xl">
      <div className="flex p-5 px-10 justify-center">
        <form
          className="w-full p-6"
          onSubmit={async (evt) => {
            evt.preventDefault();
            await startMusicRoom(roomId, {
              category,
              playlist,
              roundQuantity: rounds.rounds,
              difficulty,
            });
          }}
        >
          <h1 className="mr-auto text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-800">
            Creá tu juego
          </h1>
          <CustomListbox<typeof categories[0]>
            label="Categoría"
            options={categories}
            renderOption={(category) => (category ? category.name : "-")}
            selected={category}
            setSelected={setCategory}
          />
          <CustomListbox<typeof playlistsOptions[0]>
            label="Playlist"
            options={playlistsOptions}
            renderOption={(playlist) => (playlist ? playlist.name : "-")}
            selected={playlist}
            setSelected={setPlaylist}
          />
          <div className="flex justify-between space-x-5">
            <div className="flex flex-col w-full">
              <CustomListbox<{ id: string; rounds: number }>
                label="Cantidad de canciones"
                options={[
                  { id: "5", rounds: 5 },
                  { id: "10", rounds: 10 },
                  { id: "15", rounds: 15 },
                  { id: "20", rounds: 20 },
                ]}
                renderOption={(option) => option.rounds.toString()}
                selected={rounds}
                setSelected={setRounds}
              />
            </div>
            <div className="flex flex-col w-full">
              <CustomListbox<{
                id: string;
                seconds: number;
                description: string;
              }>
                label="Dificultad"
                options={[
                  { id: "easy", seconds: 30, description: "Fácil (30s)" },
                  { id: "medium", seconds: 20, description: "Media (20s)" },
                  { id: "hard", seconds: 10, description: "Difícil (10s)" },
                ]}
                renderOption={(option) => option.description}
                selected={difficulty}
                setSelected={setDifficulty}
              />
            </div>
          </div>
          <label className="mt-4 mb-1 block font-normal text-gray-500">
            Link para compartir
          </label>
          <div className="flex w-full my-2">
            <input
              type="text"
              className="relative h-12 w-full bg-white border border-gray-300 border-r-0 rounded-l-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:text-base"
              value={`${BASE_URL}/music/room/${roomId}`}
              disabled
            />
            <div className="flex">
              <button
                type="button"
                // onClick={handleCopy}
                className="flex items-center rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                {false ? "Copiado!" : "Copiar"}
                <FaRegCopy size="1em" className="ml-2" />
              </button>
            </div>
          </div>
          <button
            className={clsx(
              "flex flex-row items-center justify-center mt-7 w-full p-4 pb-3 rounded-md text-white",
              canSubmit
                ? "bg-purple-400 hover:bg-purple-600"
                : "bg-gray-400 opacity-50 cursor-not-allowed"
            )}
            disabled={!canSubmit}
          >
            <h2 className="text-lg font-semibold tracking-wider subpixel-antialiased">
              Empezar
            </h2>
          </button>
        </form>
      </div>
    </div>
  );
};

interface SettingsBoardProps {
  categories: GameBoardProps["categories"];
  roomId: string;
}

export const Starting: React.FC<StartingProps> = ({ ...props }) => {
  return (
    <>
      <div className="flex justify-center p-5">
        <div className="flex flex-col align-middle items-center">
          <RacingFlagSvg className="w-20 mb-2 " />
          <div className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-400">
            Preparados, el juego está por empezar!
          </div>
        </div>
      </div>
    </>
  );
};

interface StartingProps {}

export const Question: React.FC<QuestionProps> = ({ song, ...props }) => {
  return (
    <>
      <div className="flex justify-center p-5">
        <div className="flex flex-col align-middle items-center">
          <MusicSvg className="w-20 mb-2" />
          <div className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-400">
            Adiviná la canción o el artista
          </div>
        </div>
      </div>
      <div className="flex justify-center p-5 pt-0">
        <input
          autoFocus
          type="text"
          placeholder=""
          autoComplete="false"
          className="py-4 placeholder-blue-400 text-gray-700 bg-white rounded border-indigo-300 shadow outline-none focus:outline-none focus:ring w-full text-center text-2xl"
        />
      </div>
    </>
  );
};

interface QuestionProps {
  song: Song;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  round,
  roundQuantity,
  timeLeft,
  player,
}) => {
  return (
    <div className="flex flex-row items-center p-5">
      <div className="w-1/3 text-sm">
        {/* <span className="block font-semibold">{question?.song.playlist}</span> */}
        <span className="block text-sm font-light text-gray-700">
          Canción {round} / {roundQuantity}
        </span>
      </div>
      <div className="flex align-middle justify-center w-1/3">
        <div className="rounded-full h-16 w-16 flex items-center justify-center border-yellow-400 border-solid border-8 font-bold tracking-wide">
          {(timeLeft / 1000).toFixed(0)}
        </div>
      </div>
      <div className="flex justify-end w-1/3">
        <div className="flex flex-col items-center mx-4">
          <div className="text-base font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              -
            </span>
          </div>
          <span className="block text-sm font-light text-gray-700">
            {player?.score || 0} pts
          </span>
        </div>
        <img
          src={player?.photoURL}
          alt={player?.displayName}
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

interface HeaderStatsProps {
  player: RoomData["players"][0];
  round: number;
  roundQuantity: number;
  timeLeft: number;
}

export const PlayingBoard: React.FC<PlayingBoardProps> = ({
  timeEnd,
  currentRound,
  status,
  players,
  ...props
}) => {
  const [timeFrom, setTimeFrom] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeFrom);

  useEffect(() => {
    const newTimeFrom = (timeEnd?.toMillis() - Date.now() - 500) / 1000;
    console.log(`Time left - ${newTimeFrom} - ${new Date().toISOString()}`);

    setTimeFrom(newTimeFrom * 1000);
    setTimeLeft(newTimeFrom * 1000);
  }, [timeEnd]);

  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 10 <= 0 ? 0 : timeLeft - 10);
    }, 10);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <div className="flex flex-col h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      <Line percent={(timeLeft / timeFrom) * 100} strokeColor="#b794f4" />
      <HeaderStats timeLeft={timeLeft} player={null} {...props} />
      {status === RoomStatus.Starting && <Starting />}
      {status === RoomStatus.Question && (
        <Question song={currentRound.question.song} />
      )}
      {status === RoomStatus.RoundLeaderBoard && (
        <RoundLeaderBoard players={currentRound.playerScores} />
      )}
    </div>
  );
};

interface PlayingBoardProps {
  timeEnd: RoomData["roundEndsTimestamp"];
  round: RoomData["round"];
  roundQuantity: RoomData["roundQuantity"];
  currentRound: RoomData["currentRound"];
  status: RoomData["status"];
  players: RoomData["players"];
}

export const RoundLeaderBoard: React.FC<RoundLeaderBoardProps> = ({
  players,
  ...props
}) => {
  return (
    <>
      <div className="flex justify-center p-5">
        <div className="flex flex-col align-middle items-center">
          <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-400">
            Puntajes de la ronda
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-5 pt-0">
        <DecisionMakingSvg className="w-20 mb-5" />
        {players.length === 0 && (
          <div className="text-2xl text-gray-600">Nadie adivinó 😔</div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center p-5 pt-0 divide-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-row items-center justify-between py-4 w-1/2"
          >
            <div className="flex items-center">
              <img
                src={player.photoURL}
                alt={player.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-4">
                <span className="block font-semibold">
                  {player.displayName}
                </span>
              </div>
            </div>
            <div>
              <span className="block px-3 py-1 text-xs font-extrabold tracking-wide border border-gray-400 rounded-full bg-blue-400 text-white border-transparent">
                {player.score} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

interface RoundLeaderBoardProps {
  players: RoomData["players"];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  roomData,
  categories,
}) => {
  if (!roomData) {
    // TODO: loading
    return null;
  }

  if (roomData.status === RoomStatus.Settings) {
    return <SettingsBoard categories={categories} roomId={roomData.roomId} />;
  }

  return (
    <PlayingBoard
      timeEnd={roomData.roundEndsTimestamp}
      currentRound={roomData.currentRound}
      players={roomData.players}
      round={roomData.round}
      roundQuantity={roomData.roundQuantity}
      status={roomData.status}
    />
  );
};

interface GameBoardProps {
  roomData: RoomData;
  categories: Category[];
}
