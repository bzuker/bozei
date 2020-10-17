import { useForm } from "react-hook-form";
import { FaEdit, FaImage, FaPlus, FaTimes } from "react-icons/fa";
import Layout from "../../components/layout";
import Modal from "../../components/Modal";
import { Question } from "../../components/Question";

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

function CreateForm({ register }) {
  return (
    <form className="w-full">
      <div className="px-5 md:px-10 pb-6">
        <h2 className="text-xl font-bold text-gray-700 -ml-2 md:-ml-4 mb-4">Crear Juego</h2>
        <div className="flex flex-wrap mb-0 md:mb-6 -mx-3">
          <div className="w-full md:w-2/3">
            <div className="w-full px-3 mb-2">
              <label className="block mb-2 font-bold tracking-wide text-gray-700">Nombre</label>
              <input
                className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white text-sm md:text-base"
                type="text"
                placeholder="Título del juego"
                name="title"
                ref={register({ required: true })}
              />
            </div>
            <div className="w-full px-3">
              <label className="block mb-2 font-bold tracking-wide text-gray-700">
                Descripción
              </label>
              <input
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500 text-sm md:text-base"
                id="grid-last-name"
                type="text"
                placeholder="Texto que se mostrará al inicio del juego"
                name="description"
                ref={register}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0 md:mb-0 flex justify-center">
            <label className="flex flex-col w-full items-center px-2 py-2 md:py-10 bg-white text-blue rounded-lg shadow-sm tracking-wide border border-blue cursor-pointer hover:bg-indigo-200">
              <FaImage size="3em" />
              <span className="mt-2 text-base leading-normal">Imagen</span>
              <input type="file" className="hidden" name="image" ref={register} />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

function QuestionItem({ remove, onEdit, question }) {
  return (
    <li className="flex flex-wrap md:justify-between items-center p-4 w-full border rounded-lg border-gray-300 mb-2">
      <p className="w-full md:w-4/5 pb-3 md:pb-0">{question.text}</p>
      <div>
        <button
          type="button"
          className="px-3 py-2 transition duration-150 ease-in-out border rounded-md hover:bg-blue-200"
        >
          <FaEdit size="1.2em" className="text-blue-600" />
        </button>
        <button
          type="button"
          className="ml-2 px-3 py-2 transition duration-150 ease-in-out border rounded-md hover:bg-red-200"
          onClick={remove}
        >
          <FaTimes size="1.2em" color="red" />
        </button>
      </div>
    </li>
  );
}

function Create() {
  const { handleSubmit, ...formProps } = useForm();

  const [showModal, setShowModal] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);

  const onQuestionSave = (newQuestion) => {
    console.log(newQuestion);
    setQuestions([...questions, newQuestion]);
    setShowModal(false);
  };

  return (
    <>
      <Layout>
        <div className="flex pt-6 bg-white place-content-center shadow">
          <div className="w-full overflow-hidden">
            <CreateForm {...formProps} />
          </div>
        </div>
        <div className="flex pt-6 bg-white place-content-center shadow mt-4 mb-16">
          <div className="w-full overflow-hidden">
            <div className="px-5 md:px-10 pb-6">
              <h2 className="text-xl font-bold text-gray-700 -ml-2 md:-ml-4">Preguntas</h2>

              <ul className="mt-5 mb-5">
                {questions.map((x) => (
                  <QuestionItem
                    key={x.text}
                    question={x}
                    remove={() => setQuestions(questions.filter((q) => q.id !== x.id))}
                  />
                ))}
              </ul>

              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="mr-2" /> Agregar pregunta
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <div className="flex justify-end fixed w-full bottom-0 items-center p-2 md:p-5 text-center bg-gray-200">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
          onClick={handleSubmit((data) => console.log(data))}
        >
          Guardar
        </button>
      </div>
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} title="Nueva pregunta">
        <Question onSave={onQuestionSave} />
      </Modal>
    </>
  );
}

export default Create;
