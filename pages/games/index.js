import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useSWR from "swr";
import Layout from "../../components/layout";
import Modal from "../../components/Modal";
import { useUser } from "../../context/Auth";
import gameApi from "../../models/game";

function DeleteButton({ game, mutate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);
    await gameApi.deleteGameById(game.id);
    mutate();
    setIsSubmitting(false);
    setModalOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="hover:bg-indigo-100 font-bold py-3 px-4 text-sm border border-red-300 text-red-500 shadow-xs rounded-md"
      >
        <FaTrashAlt size="1em" />
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title={`Estás seguro que querés eliminar "${game.title}"?`}
      >
        <div className="mt-5">
          <button
            onClick={onDelete}
            className="hover:bg-indigo-100 font-bold py-2 px-4 text-sm border border-red-300 text-red-500 shadow-xs rounded-md"
          >
            {isSubmitting ? (
              <div className="flex space-x-2 animate-pulse py-1 px-1">
                <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                <div className="w-3 h-3 bg-red-300 rounded-full"></div>
              </div>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Game({ game, mutate }) {
  const questionsLength = game.questions.length;
  return (
    <div className="mt-4 w-full bg-white">
      <div className="flex flex-wrap justify-between border rounded-lg border-gray-300 p-4 md:p-6">
        <div className="flex">
          <div className="w-12 h-12 md:w-16 md:h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-lg bg-purple-100 text-purple-500 flex-shrink-0">
            {/* <img src={game.image || "tailwind-logo.svg"} /> */}
            <Image width={500} height={500} src={game.image || "/tailwind-logo.svg"} />
          </div>
          <div className="ml-2 md:ml-0">
            <h2 className="flex flex-wrap items-center text-gray-900 text-lg title-font font-medium mb-3">
              {game.title}
              <span className="hidden sm:block bg-indigo-200 text-indigo-600 px-2 py-1 rounded-full uppercase text-xs ml-3">
                {questionsLength} {questionsLength > 1 ? "preguntas" : "pregunta"}
              </span>
            </h2>
            <p className="text-base">{game.description}</p>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Link href={`/play/${game.id}`}>
            <button className="hover:bg-indigo-100 font-bold py-2 px-4 text-sm border border-indigo-500 text-indigo-600 shadow-xs rounded-md mr-2">
              Jugar ahora!
            </button>
          </Link>
          <Link href={`/games/edit/${game.id}`}>
            <button className="hover:bg-indigo-100 font-bold py-3 px-4 text-sm border border-gray-400 shadow-xs rounded-md mr-2">
              <FaPencilAlt size="1em" />
            </button>
          </Link>
          <DeleteButton game={game} mutate={mutate} />
        </div>
      </div>
    </div>
  );
}

function Games() {
  const { user } = useUser({ redirectTo: "/login" });
  const { data: games, error, mutate } = useSWR([user?.id, "games"], gameApi.getGamesForUserId);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <header className="bg-white shadow">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold leading-tight text-gray-900">Mis Juegos</h1>
          <Link href="/games/create">
            <button className="hover:bg-indigo-700 bg-indigo-500 text-white text-lg font-bold py-2 px-4 border border-gray-400 shadow-xs rounded-md">
              Crear nuevo
            </button>
          </Link>
        </div>
      </header>
      {games && games.map((game) => <Game key={game.id} game={game} mutate={mutate} />)}
    </Layout>
  );
}

export default Games;
