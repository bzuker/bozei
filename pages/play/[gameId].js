import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import useSWR from "swr";
import Layout from "../../components/layout";
import { useUser } from "../../context/Auth";
import useGameplay from "../../hooks/useGameplay";
import gameApi from "../../models/game";

function Welcome({ title, description, image, tags, startGame }) {
  return (
    <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
      <div className="flex flex-col max-w-screen-md overflow-hidden bg-white border rounded-lg shadow-xl lg:flex-row sm:mx-auto justify-center">
        <div className="flex flex-col justify-center p-8 bg-white lg:p-12 text-center">
          <div>
            <p className="inline-block px-3 py-1 mb-4 mr-1 text-xs font-medium tracking-wider text-purple-600 uppercase rounded-full bg-purple-200">
              Cultura
            </p>
            <p className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-green-600 uppercase rounded-full bg-green-200">
              Deportes
            </p>
          </div>
          <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">{title}</h5>
          {image && (
            <div className="flex items-center justify-center">
              <img src={image} className="h-40 md:h-64" />
            </div>
          )}
          <p className="mb-5 text-gray-800 py-5">{description}</p>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="inline-flex items-center px-8 py-3 text-2xl font-semibold leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
              onClick={startGame}
            >
              A Jugar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAnswerStatus(answerId, selectedId, correctId) {
  if (!selectedId) {
    return "NOT_SELECTED";
  }

  if (answerId === correctId) {
    return "CORRECT";
  }

  if (selectedId !== answerId) {
    return "NOT_SELECTED";
  }

  return "INCORRECT";
}

function MultipleChoiceQuestion({
  question = {},
  selected,
  questionsLeft,
  onAnswerSelected,
  onNextQuestion,
}) {
  return (
    <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24">
      <div className="flex max-w-screen-md overflow-hidden bg-white border rounded-lg shadow-md lg:flex-row sm:mx-auto">
        <div className="flex flex-col w-full justify-center p-2 md:p-6 bg-white">
          <div className="flex justify-between">
            {question.tag && (
              <p className="px-3 py-1 text-xs font-medium tracking-wider text-purple-600 uppercase rounded-full bg-purple-200">
                {question.tag}
              </p>
            )}
            <p className="tracking-widest">{questionsLeft}</p>
          </div>
          <h5 className="mb-3 mt-3 text-2xl font-medium leading-snug md:leading-none sm:text-4xl">
            {question.text}
          </h5>
        </div>
      </div>
      <div>
        {question.answers.map((answer) => (
          <Answer
            key={answer.id}
            text={answer.text}
            onClick={() => onAnswerSelected(answer)}
            status={getAnswerStatus(answer.id, selected?.id, question.correctAnswerId)}
          />
        ))}
        {selected && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onNextQuestion}
              className="flex items-center px-6 py-4 font-bold text-md md:text-2xl text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              Siguiente pregunta
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Answer({ text, status, onClick }) {
  const classes = clsx(
    "flex w-full max-w-screen-md border rounded-lg sm:mx-auto mt-4 focus:outline-none ",
    status === "NOT_SELECTED" && "bg-white hover:bg-indigo-100 hover:border-indigo-400",
    status === "CORRECT" && "bg-green-300",
    status === "INCORRECT" && "bg-red-300"
  );
  return (
    <button className={classes} onClick={onClick}>
      <div className="text-left p-2 md:p-6">
        <h5 className="mb-1 mt-1 text-lg sm:text-2xl leading-snug md:leading-snug">{text}</h5>
      </div>
    </button>
  );
}

function GameOver({ correct, incorrect }) {
  return (
    <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
      <div className="flex flex-col max-w-screen-md overflow-hidden bg-white border rounded-lg shadow-xl lg:flex-row sm:mx-auto justify-center">
        <div className="flex flex-col justify-center p-8 bg-white lg:p-12 text-center">
          <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
            Terminaron las preguntas!
          </h5>
          <p className="mb-5 text-gray-800 py-5">Este fue tu resultado:</p>
          <div className="flex items-center justify-between">
            <div className="border-2 border-gray-200 px-6 py-4 rounded-lg bg-green-300 w-2/5">
              <div className="flex flex-col items-center">
                <h2 className="title-font font-medium text-3xl text-gray-900">{correct}</h2>
                <p className="leading-relaxed">{`Correcta${
                  correct > 1 || correct === 0 ? "s" : ""
                }`}</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 px-6 py-4 rounded-lg bg-red-300 w-2/5">
              <div className="flex flex-col items-center">
                <h2 className="title-font font-medium text-3xl text-gray-900">{incorrect}</h2>
                <p className="leading-relaxed">{`Incorrecta${
                  incorrect > 1 || incorrect === 0 ? "s" : ""
                }`}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-16">
            <Link href="/explore">
              <a
                className="text-white bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400 
              hover:scale-105 transition duration-100 ease-in-out transform  
              px-8 py-3 border border-transparent leading-6 font-medium rounded-md md:py-4 md:text-lg md:px-10"
              >
                Buscar otro juego
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function useGameStats({ gameId, status, selected, currentQuestion, correctGuesses }) {
  const { user } = useUser();
  const [statId, setStatId] = useState();

  useEffect(() => {
    const createStat = async () => {
      const newStatId = await gameApi.savePlayedStat({
        gameId,
        stat: {
          userId: user?.id || null,
          started: true,
          startTs: Date.now(),
        },
      });
      setStatId(newStatId);
    };

    // Started playing
    if (status === "PLAYING") {
      createStat();
    }
  }, [status, user, gameId]);

  useEffect(() => {
    // Reached the end
    if (status === "GAME_ENDED") {
      gameApi.savePlayedStat({
        gameId,
        statId,
        stat: {
          ended: true,
          correctGuesses,
          endTs: Date.now(),
        },
      });
    }
  }, [status, correctGuesses, gameId, statId]);

  useEffect(() => {
    // No guess yet
    if (!selected) {
      return;
    }

    // Send guess
    gameApi.savePlayedStat({
      gameId,
      statId,
      stat: {
        [currentQuestion.id]: selected,
      },
    });
  }, [gameId, currentQuestion, selected, statId]);
}

function Game({ game }) {
  const { gameState, totalQuestions, startGame, onAnswerSelected, nextQuestion } = useGameplay(
    game
  );

  useGameStats(gameState);

  console.log(gameState);

  if (gameState.status === "NOT_STARTED") {
    return (
      <Layout>
        <Welcome
          title={game.title}
          description={game.description}
          image={game.image}
          startGame={startGame}
        />
      </Layout>
    );
  }

  if (gameState.status === "PLAYING") {
    return (
      <Layout>
        <MultipleChoiceQuestion
          question={gameState.currentQuestion}
          onAnswerSelected={onAnswerSelected}
          onNextQuestion={nextQuestion}
          selected={gameState.selected}
          questionsLeft={`${gameState.currentIndex} / ${totalQuestions}`}
        />
      </Layout>
    );
  }

  if (gameState.status === "GAME_ENDED") {
    return (
      <Layout>
        <GameOver
          correct={gameState.correctGuesses}
          incorrect={totalQuestions - gameState.correctGuesses}
        />
      </Layout>
    );
  }
}

function Play() {
  const router = useRouter();
  const { gameId } = router.query;
  const { data: game, error } = useSWR([gameId], gameApi.getGameById);

  if (!game) {
    return (
      <Layout>
        <div className="border border-gray-300 shadow-xl rounded-md p-4 mx-auto max-w-3xl">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-40 bg-gray-400 rounded w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 bg-gray-400 rounded w-1/5"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return <Game game={game} />;
}

export default Play;
