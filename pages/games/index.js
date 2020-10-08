import Layout from "../../components/layout";

function Game({ name, description, image, url, categories }) {
  return (
    <div className="mt-4 w-full bg-white">
      <div className="flex border rounded-lg border-gray-300 p-6 sm:flex-row flex-col">
        <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-500 flex-shrink-0">
          <img src={image || "tailwind-logo.svg"} />
        </div>
        <div className="flex-grow">
          <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
            Shooting Stars
            <span class="bg-indigo-200 text-indigo-600 px-2 py-1 rounded-full uppercase text-xs ml-3">
              psychology
            </span>
          </h2>
          <p className="text-base">
            Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub
            indxgo juice poutine.
          </p>
          <div className="mt-3">
            <button class=" hover:bg-indigo-300 font-bold py-2 px-4 text-sm border border-gray-400 shadow-xs rounded-md mr-2">
              Jugar ahora!
            </button>
            <button class=" hover:bg-indigo-300 font-bold py-2 px-4 text-sm border border-gray-400 shadow-xs rounded-md">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Games() {
  return (
    <Layout>
      <header className="bg-white shadow">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold leading-tight text-gray-900">Mis Juegos</h1>
          <button class="hover:bg-indigo-700 bg-indigo-500 text-white text-lg font-bold py-2 px-4 border border-gray-400 shadow-xs rounded-md">
            Crear nuevo
          </button>
        </div>
      </header>
      <Game />
      <Game />
    </Layout>
  );
}

export default Games;
