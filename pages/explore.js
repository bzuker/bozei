import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import Layout from "../components/layout";
import { useUser } from "../context/Auth";
import gameApi from "../models/game";

function GameCard({ id, title, description, questions, tags, date, stats, image }) {
  console.log(tags);
  return (
    <Link href={`/play/${id}`}>
      <div className="flex flex-col overflow-hidden rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
        <div className="relative flex-shrink-0">
          <Image
            className="object-cover w-full h-40 bg-white"
            src={image || "/bozei.svg"}
            width={800}
            height={600}
          />
          <span className="absolute bottom-0 right-0 inline-flex items-center px-3 py-1 mr-2 -mb-3 text-xs font-medium leading-tight bg-gray-200 border rounded-full">
            {questions?.length || 10} preguntas
          </span>
          {stats && (
            <span className="absolute bottom-0 left-0 inline-flex items-center px-3 py-1 ml-2 -mb-3 text-xs font-medium leading-tight bg-gray-200 border rounded-full">
              {stats.played || 100} jugados
            </span>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col justify-between flex-1 p-6 bg-white">
            <div>
              <h2 className="block text-xl font-semibold leading-7 text-gray-900">{title}</h2>
              <p className="mt-3 text-base leading-6 text-gray-700">{description}</p>
            </div>
            <p className="mt-3 text-sm font-medium leading-5">
              {tags?.map((tag) => (
                <span
                  key={tag.value}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium leading-tight text-blue-800 bg-blue-100 rounded-full"
                >
                  {tag.label}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  const Card = () => (
    <div className="p-2 border border-gray-300 rounded-md shadow max-h-md">
      <div className="flex animate-pulse">
        <div className="flex-1 py-1 space-y-4">
          <div className="w-full h-40 bg-gray-400 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="px-4 pt-2 pb-8 mx-6 md:mx-16 sm:px-6 lg:px-8">
      <div className="grid max-w-lg gap-5 mx-auto mt-12 md:grid-cols-2 lg:grid-cols-3 md:max-w-none">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

function Explore() {
  const { user } = useUser({ redirectTo: "/login" });
  const { data: games, error } = useSWR(["/games"], () =>
    gameApi.getGames({ limit: 10, where: ["isPublic", "==", true] })
  );

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-w-screen">
        <div className="relative flex flex-col items-center max-w-6xl px-4 py-8 mx-auto text-center rounded-lg shadow-2xl lg:text-left lg:block bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400 sm:px-6 md:pb-0 md:pt-12 lg:px-6 lg:py-6">
          <h2 className="text-center my-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:my-0 xl:text-4xl sm:leading-tight">
            A qué vas a jugar <span className="block text-blue-100 xl:inline">hoy?</span>
          </h2>
        </div>
      </div>
      {!games ? (
        <Skeleton />
      ) : (
        <div className="container flex flex-col items-center justify-center px-4 pt-2 pb-8 mx-auto sm:px-6 lg:px-8">
          <div className="grid max-w-lg gap-5 mx-auto mt-12 md:grid-cols-2 lg:grid-cols-3 md:max-w-none">
            {games.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Explore;
