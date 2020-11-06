import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import Layout from "./layout";
import Modal from "./Modal";
import { Question } from "./Question";
import { useUser } from "../context/Auth";
import gameApi from "../models/game";
import Link from "next/link";
import { useReducer, useState } from "react";
import clsx from "clsx";
import FileUpload from "./FileUpload";
import { mutate } from "swr";
import Select from "react-select";
import { TAGS } from "../utils/constants";

function CreateForm({ register, errors, control, image, setImage }) {
  return (
    <form className="w-full mb-2">
      <div className="px-5 md:px-10">
        <div className="flex flex-wrap mb-0 md:mb-3 -mx-3">
          <div className="w-full md:w-2/3">
            <div className="w-full px-3 mb-2">
              <label className="block mb-2 font-bold tracking-wide text-gray-700">Nombre</label>
              <input
                className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white text-sm md:text-base"
                type="text"
                placeholder="Título del juego"
                name="title"
                ref={register({ required: true })}
              />
              {errors.title && <p className="text-red-500">* Falta completar este campo</p>}
            </div>
            <div className="w-full px-3 mb-2">
              <label className="block mb-2 font-bold tracking-wide text-gray-700">
                Descripción
              </label>
              <input
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500 text-sm md:text-base"
                type="text"
                placeholder="Texto que se mostrará al inicio del juego"
                name="description"
                ref={register}
              />
            </div>
            <div className="w-full px-3">
              <label className="block mb-2 font-bold tracking-wide text-gray-700">Tags</label>
              <Controller
                as={Select}
                options={TAGS.map((x) => ({ value: x, label: x }))}
                name="tags"
                isMulti
                control={control}
                placeholder="Elegí una o más categorías"
                noOptionsMessage={({ inputValue }) => `${inputValue} no es una categoría válida`}
                closeMenuOnSelect={false}
                tabSelectsValue={false}
              />
            </div>
            <div className="w-full px-3 mt-6">
              <label className="flex items-center mb-2 tracking-wide text-gray-700 cursor-pointer">
                <input
                  className="form-checkbox text-green-500 p-2 md:p-2 border-2 border-gray-500 cursor-pointer"
                  type="checkbox"
                  placeholder="Texto que se mostrará al inicio del juego"
                  name="isPublic"
                  ref={register}
                />
                <span className="ml-2">Hacer público</span>
              </label>
              <p className="-mt-1 text-gray-500 text-sm leading-6">
                Otras personas podrán ver y jugar este juego
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 h-56 mt-4 md:mt-0 md:mb-0 flex justify-center">
            <FileUpload image={image} setImage={setImage} />
          </div>
        </div>
      </div>
    </form>
  );
}

function QuestionItem({ remove, edit, question }) {
  return (
    <li className="border rounded-lg border-gray-300 mb-4">
      <div className="bg-gray-200 px-4 py-1 sm:px-4 sm:flex sm:flex-row-reverse">
        <div className="flex flex-wrap justify-between items-center w-full">
          <div className="flex items-center md:w-4/5 md:pb-0">
            <p className="">{question.text}</p>
            {question?.tags?.map((tag) => (
              <span
                key={tag.value}
                className="hidden md:flex px-3 ml-2 text-xs font-medium tracking-wider text-blue-600 uppercase rounded-full bg-blue-200"
              >
                {tag.label}
              </span>
            ))}
          </div>
          <div>
            <button
              type="button"
              className="bg-white px-3 py-2 transition duration-150 ease-in-out border rounded-md hover:bg-blue-200"
              onClick={edit}
            >
              <FaPencilAlt size="1em" />
            </button>
            <button
              type="button"
              className="bg-white ml-2 px-3 py-2 transition duration-150 ease-in-out border rounded-md hover:bg-red-200"
              onClick={remove}
            >
              <FaRegTrashAlt size="1em" color="red" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap p-2 md:px-4">
        {question.answers.map((answer, i) => (
          <div key={i} className="flex items-center w-1/2 mt-1">
            <div
              className={clsx(
                `w-3 h-3 rounded-full mr-2`,
                answer.isCorrect ? "bg-green-500" : "bg-red-500"
              )}
            ></div>
            {answer.text}
          </div>
        ))}
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
      isPublic: existingGame?.isPublic,
      tags: existingGame?.tags || [],
    },
  });
  const [questions, setQuestions] = useState(existingGame?.questions || []);
  const [image, setImage] = useState({ preview: existingGame?.image });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, dispatch] = useReducer(questionModalReducer, {
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
      image: image,
      questions,
      userId: user.id,
      id: existingGame?.id || null,
    };

    try {
      await gameApi.saveGame(gameData);
      gameData.id ? mutate([gameData.id]) : null;
      router.push("/games");
    } catch (error) {
      console.error("failed creating game", error);
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
          <div className="w-full">
            <CreateForm errors={errors} {...formProps} image={image} setImage={setImage} />
          </div>
        </div>
        <div className="flex pt-2 md:pt-4 bg-white place-content-center shadow mt-4 mb-16">
          <div className="w-full overflow-hidden">
            <div className="px-2 md:px-10 pb-6">
              <h2 className="text-xl font-bold text-gray-700 md:-ml-4">Preguntas</h2>

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
            className="inline-flex items-center px-5 md:px-8 py-2 md:py-3 text-base 
          font-medium leading-6 transition duration-150 ease-in-out border-2 
          rounded-md hover:bg-gray-400 mr-5"
          >
            Volver
          </button>
        </Link>
        <button
          type="button"
          className="inline-flex items-center px-5 md:px-8 py-2 md:py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
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
