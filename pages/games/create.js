import { FaPlus, FaTimes } from "react-icons/fa";
import Layout from "../../components/layout";

function Steps() {
  return (
    <div className="flex items-center">
      <div className="flex items-center text-teal-600 relative">
        <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-bookmark "
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
          Personal
        </div>
      </div>
      <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
      <div className="flex items-center text-white relative">
        <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-user-plus "
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        </div>
        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
          Account
        </div>
      </div>
      <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
      <div className="flex items-center text-gray-500 relative">
        <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-mail "
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
          Message
        </div>
      </div>
      <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
      <div className="flex items-center text-gray-500 relative">
        <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-database "
          >
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
          Confirm
        </div>
      </div>
    </div>
  );
}

function AnswerOption() {
  return (
    <div className="flex items-center mb-2 md:mb-4 ">
      <button className="mr-2 text-red-500">
        <FaTimes />
      </button>
      <textarea
        className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500 overflow-y-hidden"
        type="text"
        placeholder="Respuesta 1"
      />
      <input
        type="checkbox"
        className="ml-5 form-checkbox text-green-500 p-2 md:p-3 border-2 border-gray-500"
      />
    </div>
  );
}

function Question() {
  return (
    <div className="flex flex-wrap m-3 -mx-3 border rounded-lg py-2">
      <div className="w-full md:w-2/3 px-3 mb-6 md:mb-3">
        <label className="block mb-2 font-bold tracking-wide text-gray-700">Pregunta</label>
        <input
          className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          type="text"
          placeholder="Una pregunta para contestar"
        />
      </div>
      <div className="w-full px-3 md:w-2/3">
        <div className="flex justify-between">
          <label className="mb-2 font-bold tracking-wide text-gray-700">Respuestas</label>
          <label className="mb-2 font-bold tracking-wide text-gray-700">Es Correcta?</label>
        </div>
        <AnswerOption />
        <AnswerOption />
        <AnswerOption />
        <button type="button" className="text-gray-700 px-3 py-1 underline focus:outline-none">
          Agregar respuesta
        </button>
      </div>
    </div>
  );
}

function Create() {
  return (
    <Layout>
      <div className="flex p-1 pt-6 bg-white place-content-center shadow">
        <div className="w-full overflow-hidden">
          {/* <Steps /> */}
          <form className="w-full">
            <div className="px-5 md:px-10 pb-6">
              <h2 className="text-xl font-bold text-gray-700 -ml-2 md:-ml-4 mb-4">Crear Juego</h2>
              <div className="flex flex-wrap mb-0 md:mb-6 -mx-3">
                <div className="w-full md:w-2/3">
                  <div className="w-full px-3 mb-2">
                    <label className="block mb-2 font-bold tracking-wide text-gray-700">
                      Nombre
                    </label>
                    <input
                      className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                      type="text"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block mb-2 font-bold tracking-wide text-gray-700">
                      Descripción
                    </label>
                    <input
                      className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3 md:mb-0">
                  <label className="rounded-lg shadow-md bg-gray-500 border-gray-200 h-full my-2 mx-2 cursor-pointer">
                    <input id="upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-700 -ml-2 md:-ml-4">Definir Preguntas</h2>

              <Question />
              <Question />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
              >
                <FaPlus className="mr-2" /> Agregar pregunta
              </button>
            </div>
            <div className="flex items-center justify-between p-5 text-center bg-gray-200">
              <div className="relative flex flex-col items-start mr-1 text-sm">
                <span className="mr-1 text-gray-500">Already have an account?</span>
                <a href="#_" className="block font-medium text-indigo-600 underline">
                  Login Here
                </a>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Create;
