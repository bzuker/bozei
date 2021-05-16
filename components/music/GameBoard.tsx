import { Line } from "rc-progress";
import MusicSvg from "../MusicSvg";

import React, {
  useState,
  useEffect,
  Fragment,
  SetStateAction,
  Dispatch,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  FaCheck,
  FaCheckSquare,
  FaChevronDown,
  FaRegCopy,
  FaRegTimesCircle,
} from "react-icons/fa";
import { BASE_URL } from "../../utils/constants";
import useSWR from "swr";
import {
  Artist,
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
import { useAudio } from "react-use";
import TrophySvg from "../svg/TrophySvg";
import { arrayUnion, musicRoomsRef } from "../../utils/auth/firebase";
import { useUser } from "../../context/Auth";

interface CustomListboxProps<T> {
  label: string;
  options: Array<T>;
  renderOption: (selected: T) => string;
  selected: T;
  setSelected: Dispatch<SetStateAction<T>>;
  disabled?: boolean;
}

function CustomListbox<T extends { id: string }>({
  label,
  options,
  renderOption,
  selected,
  setSelected,
  disabled = false,
}: CustomListboxProps<T>) {
  return (
    <Listbox value={selected} onChange={setSelected} disabled={disabled}>
      {({ open }) => (
        <>
          <Listbox.Label className="mt-4 mb-1 block font-normal text-gray-500">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button
              className={clsx(
                disabled && "bg-gray-300 cursor-not-allowed",
                "relative h-12 w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:text-base"
              )}
            >
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
  createdBy,
  ...props
}) => {
  const { user } = useUser();
  const [category, setCategory] = useState<typeof categories[0]>(null);
  const [playlist, setPlaylist] = useState(null);
  const [rounds, setRounds] = useState({ id: "10", rounds: 10 });
  const [difficulty, setDifficulty] = useState({
    id: "medium",
    seconds: 20,
    description: "Media (20s)",
  });
  const { data: playlistsOptions = [] } = useSWR<
    { id: string; name: string; imageUrl: string }[]
  >(() => `/api/spotify/playlists?categoryId=${category.id}`);

  const canSubmit = category && playlist;
  const isCreatorOfGame = user?.id === createdBy.id;

  return (
    <div className="flex md:p-5 md:px-10 justify-center">
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
          disabled={!isCreatorOfGame}
        />
        <CustomListbox<typeof playlistsOptions[0]>
          label="Playlist"
          options={playlistsOptions}
          renderOption={(playlist) => (playlist ? playlist.name : "-")}
          selected={playlist}
          setSelected={setPlaylist}
          disabled={!isCreatorOfGame}
        />
        <div className="flex flex-col md:flex-row justify-between md:space-x-5">
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
              disabled={!isCreatorOfGame}
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
              disabled={!isCreatorOfGame}
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
              <div className="hidden md:block">
                {false ? "Copiado!" : "Copiar"}
              </div>
              <FaRegCopy size="1em" className="ml-2" />
            </button>
          </div>
        </div>
        <button
          className={clsx(
            "flex flex-row items-center justify-center mt-7 w-full p-4 pb-3 rounded-md text-white",
            isCreatorOfGame && canSubmit
              ? "bg-purple-400 hover:bg-purple-600"
              : "bg-gray-400 opacity-50 cursor-not-allowed"
          )}
          disabled={!canSubmit}
        >
          <h2 className="text-lg font-semibold tracking-wider subpixel-antialiased">
            {isCreatorOfGame
              ? "Empezar"
              : `${createdBy.displayName} va a empezar el juego`}
          </h2>
        </button>
      </form>
    </div>
  );
};

interface SettingsBoardProps {
  categories: GameBoardProps["categories"];
  roomId: string;
  createdBy: RoomData["createdBy"];
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

export const Question: React.FC<QuestionProps> = ({
  roomId,
  currentRound,
  ...props
}) => {
  const { question } = currentRound;
  const { song } = question;
  const [audio] = useAudio({
    src: song.url,
    autoPlay: true,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>(null);

  const submitSelectedOption = (answerId: string) => {
    setSelectedAnswer(answerId);
    musicRoomsRef.doc(roomId).update({
      [`currentRound.playerAnswers`]: arrayUnion({
        playerId: "bzuker",
        answerId,
      }),
    });
  };

  const options: Artist[] | Song[] =
    question.guessType === "artist" ? song.artistOptions : song.trackOptions;

  return (
    <>
      {audio}
      <div className="flex justify-center p-5">
        <div className="flex flex-col align-middle items-center">
          <MusicSvg className="w-20 mb-2" />
          <div className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-400">
            Adiviná{" "}
            {question.guessType === "artist" ? "quién canta" : "la canción"}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-5 pt-0">
        {options.map((x) => (
          <button
            key={x.id}
            className={clsx(
              !selectedAnswer
                ? "bg-white hover:bg-indigo-100 hover:border-indigo-400"
                : "cursor-default",
              selectedAnswer === x.id ? "bg-indigo-200" : "",
              "flex w-full max-w-screen-md border rounded-lg sm:mx-auto mt-4 focus:outline-none"
            )}
            onClick={() => submitSelectedOption(x.id)}
            disabled={!!selectedAnswer}
          >
            <div className="text-left p-2 md:p-6">
              <h5 className="mb-1 mt-1 text-lg sm:text-2xl leading-snug md:leading-snug">
                {x.name}
              </h5>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

interface QuestionProps {
  roomId: string;
  currentRound: RoomData["currentRound"];
}

export const Answers: React.FC<AnswersProps> = React.memo(
  ({ currentRound }) => {
    const { question } = currentRound;
    const { song } = question;

    const options: Artist[] | Song[] =
      question.guessType === "artist" ? song.artistOptions : song.trackOptions;

    const selectedAnswer = currentRound.playerAnswers.find(
      (x) => x.playerId === "bzuker"
    );
    const isCorrectAnswer = (id: string) =>
      question.guessType === "artist" ? song.artist.id === id : song.id === id;

    return (
      <>
        <div className="flex justify-center p-5">
          <div className="flex flex-col align-middle items-center">
            {isCorrectAnswer(selectedAnswer?.answerId) ? (
              <>
                <FaCheckSquare className="w-20 h-20 mb-2 text-green-500" />
                <div className="text-3xl text-green-500">Muy bien!</div>
              </>
            ) : (
              <>
                <FaRegTimesCircle className="w-20 h-20 mb-2 text-red-500" />
                <div className="text-3xl text-red-500">
                  Respuesta incorrecta
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center p-5 pt-0">
          {options.map((x) => (
            <button
              key={x.id}
              className={clsx(
                isCorrectAnswer(x.id) && "bg-green-300 border-green-600",
                selectedAnswer?.answerId === x.id &&
                  "bg-red-300 border-red-500",
                "flex w-full max-w-screen-md border rounded-lg sm:mx-auto mt-4 focus:outline-none"
              )}
              disabled
            >
              <div className="text-left p-2 md:p-6">
                <h5 className="mb-1 mt-1 text-lg sm:text-2xl leading-snug md:leading-snug">
                  {x.name}
                </h5>
              </div>
            </button>
          ))}
        </div>
      </>
    );
  }
);

interface AnswersProps {
  currentRound: RoomData["currentRound"];
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
  roundEndsTimestamp,
  currentRound,
  status,
  players,
  roomId,
  ...props
}) => {
  const [timeFrom, setTimeFrom] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeFrom);

  useEffect(() => {
    const newTimeFrom =
      (roundEndsTimestamp?.toMillis() - Date.now() - 500) / 1000;

    setTimeFrom(newTimeFrom * 1000);
    setTimeLeft(newTimeFrom * 1000);
  }, [roundEndsTimestamp?.toMillis()]);

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
    <>
      <Line percent={(timeLeft / timeFrom) * 100} strokeColor="#b794f4" />
      <HeaderStats timeLeft={timeLeft} player={null} {...props} />
      {status === RoomStatus.Starting && <Starting />}
      {status === RoomStatus.Question && (
        <Question roomId={roomId} currentRound={currentRound} />
      )}

      {status === RoomStatus.Answers && <Answers currentRound={currentRound} />}
      {status === RoomStatus.RoundLeaderBoard && (
        <RoundLeaderBoard players={currentRound.playerScores} />
      )}
      {status === RoomStatus.LeaderBoard && <LeaderBoard players={players} />}
    </>
  );
};

interface PlayingBoardProps {
  roundEndsTimestamp: RoomData["roundEndsTimestamp"];
  round: RoomData["round"];
  roundQuantity: RoomData["roundQuantity"];
  currentRound: RoomData["currentRound"];
  status: RoomData["status"];
  players: RoomData["players"];
  roomId: RoomData["roomId"];
}

export const LeaderBoard: React.FC<LeaderBoardProps> = ({
  players,
  ...props
}) => {
  return (
    <>
      <div className="flex justify-center p-5">
        <div className="flex flex-col align-middle items-center">
          <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-indigo-400">
            Puntajes finales
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-5 pt-0">
        <div className="flex flex-col items-center p-5 rounded-3xl border-yellow-200 border-4 border-dashed">
          <TrophySvg className="w-20 mb-5" />
          <div className="text-2xl text-gray-600 text-center">
            {players[0].displayName}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-5 pt-0 divide-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-row items-center justify-between py-4 w-full md:w-1/2"
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
                {player.score || 0} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

interface LeaderBoardProps {
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
            className="flex flex-row items-center justify-between py-4 w-full md:w-1/2"
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

  let component;
  if (roomData.status === RoomStatus.Settings) {
    component = (
      <SettingsBoard
        categories={categories}
        roomId={roomData.roomId}
        createdBy={roomData.createdBy}
      />
    );
  } else {
    component = <PlayingBoard {...roomData} />;
  }

  return (
    <div className="flex flex-col h-auto overflow-hidden bg-white rounded-lg shadow-xl">
      {component}
    </div>
  );
};

interface GameBoardProps {
  roomData: RoomData;
  categories: Category[];
}
