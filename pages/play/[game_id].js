import Layout from "../../components/layout";

function Welcome({ startGame }) {
  return (
    <div class="px-4 py-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-16">
      <div class="flex flex-col max-w-screen-md overflow-hidden bg-white border rounded-lg shadow-xl lg:flex-row sm:mx-auto justify-center">
        <div class="flex flex-col justify-center p-8 bg-white lg:p-12 text-center">
          <div>
            <p class="inline-block px-3 py-1 mb-4 mr-1 text-xs font-medium tracking-wider text-purple-600 uppercase rounded-full bg-purple-200">
              Cultura
            </p>
            <p class="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-green-600 uppercase rounded-full bg-green-200">
              Deportes
            </p>
          </div>
          <h5 class="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
            El título que pusiste
          </h5>
          <p class="mb-5 text-gray-800 py-5">Una descripción que pusiste cuando armaste el juego</p>
          <div class="flex items-center justify-center">
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

function Play() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  return (
    <Layout>
      {!isPlaying ? <Welcome startGame={() => setIsPlaying(true)} /> : <div>aaa</div>}
    </Layout>
  );
}

export default Play;
