import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FaEdit, FaImage, FaPlus, FaTimes } from "react-icons/fa";
import Layout from "./layout";
import Modal from "./Modal";
import { Question } from "./Question";
import { useUser } from "../context/Auth";
import gameApi from "../models/game";
import Link from "next/link";

function CreateForm({ register, errors }) {
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
              {errors.title && <p className="text-red-500">* Falta completar este campo</p>}
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
          {/* <div className="w-full md:w-1/3 mt-4 md:mt-0 md:mb-0 flex justify-center">
            <label className="flex flex-col w-full items-center px-2 py-2 md:py-10 bg-white text-blue rounded-lg shadow-sm tracking-wide border border-blue cursor-pointer hover:bg-indigo-200">
              <FaImage size="3em" />
              <span className="mt-2 text-base leading-normal">Imagen</span>
              <input type="file" className="hidden" name="image" ref={register} />
            </label>
          </div> */}
        </div>
      </div>
    </form>
  );
}

function QuestionItem({ remove, edit, question }) {
  return (
    <li className="flex flex-wrap md:justify-between items-center p-4 w-full border rounded-lg border-gray-300 mb-2">
      <p className="w-full md:w-4/5 pb-3 md:pb-0">{question.text}</p>
      <div>
        <button
          type="button"
          className="px-3 py-2 transition duration-150 ease-in-out border rounded-md hover:bg-blue-200"
          onClick={edit}
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

function questionModalReducer(state, action) {
  switch (action.type) {
    case "CREATE_QUESTION": {
      return {
        ...state,
        showModal: true,
        question: null,
        title: "Nueva pregunta",
      };
    }

    case "EDIT_QUESTION": {
      return {
        ...state,
        showModal: true,
        question: action.question,
        title: "Editar pregunta",
      };
    }

    case "CLOSE_MODAL": {
      return {
        ...state,
        showModal: false,
        question: null,
        title: "",
      };
    }
    default: {
      throw Error(`Unrecognized action ${action.type}`);
    }
  }
}

function GameForm({ existingGame = null }) {
  const { user } = useUser({ redirectTo: "/login" });
  const router = useRouter();
  const { handleSubmit, setError, clearErrors, errors, ...formProps } = useForm({
    defaultValues: {
      title: existingGame?.title,
      description: existingGame?.description,
    },
  });
  const [questions, setQuestions] = React.useState(existingGame?.questions || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [modalState, dispatch] = React.useReducer(questionModalReducer, {
    showModal: false,
    question: null,
    title: "",
  });

  const onQuestionSave = (question) => {
    const existingQuestionIndex = questions.findIndex((x) => x.id === question.id);
    // We are editing
    if (existingQuestionIndex > -1) {
      questions[existingQuestionIndex] = question;
      setQuestions(questions);
    } else {
      setQuestions([...questions, question]);
    }

    clearErrors("questions");
    dispatch({ type: "CLOSE_MODAL" });
  };

  const onSaveGame = async (data) => {
    if (questions.length === 0) {
      setError("questions", {
        type: "manual",
        message: "No podés crear un juego sin preguntas!",
      });
      return;
    }

    setIsSubmitting(true);
    const gameData = {
      ...data,
      questions,
      userId: user.id,
      id: existingGame?.id || null,
    };

    try {
      await gameApi.saveGame(gameData);
      router.push("/games");
    } catch (error) {
      console.error("failed creating game", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Layout>
        <div className="flex pt-6 bg-white place-content-center shadow">
          <div className="w-full overflow-hidden">
            <CreateForm errors={errors} {...formProps} />
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
                    edit={() => dispatch({ type: "EDIT_QUESTION", question: x })}
                  />
                ))}
              </ul>
              {errors.questions && <p className="text-red-500 mb-4">{errors.questions.message}</p>}

              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
                onClick={() => dispatch({ type: "CREATE_QUESTION" })}
              >
                <FaPlus className="mr-2" /> Agregar pregunta
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <div className="flex justify-end fixed w-full bottom-0 items-center p-1 md:p-2 bg-gray-200">
        <Link href="/games">
          <button
            type="button"
            className="inline-flex items-center px-8 py-3 text-base 
          font-medium leading-6 transition duration-150 ease-in-out border-2 
          rounded-md hover:bg-gray-400 mr-5"
          >
            Volver
          </button>
        </Link>
        <button
          type="button"
          className="inline-flex items-center px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
          onClick={handleSubmit(onSaveGame)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex space-x-2 animate-pulse py-1 px-1">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
      <Modal
        isOpen={modalState.showModal}
        onRequestClose={() => dispatch({ type: "CLOSE_MODAL" })}
        title="Nueva pregunta"
      >
        <Question question={modalState.question} onSave={onQuestionSave} />
      </Modal>
    </>
  );
}

export default GameForm;
