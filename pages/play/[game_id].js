import clsx from "clsx";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import Layout from "../../components/layout";

function Welcome({ startGame }) {
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
          <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
            El título que pusiste
          </h5>
          <p className="mb-5 text-gray-800 py-5">
            Una descripción que pusiste cuando armaste el juego
          </p>
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

function getAnswerStatus(answer, selected, correct) {
  if (!selected) {
    return "NOT_SELECTED";
  }

  if (answer === correct) {
    return "CORRECT";
  }

  if (selected.id !== answer) {
    return "NOT_SELECTED";
  }

  return "INCORRECT";
}

function MultipleChoiceQuestion({ question = {}, selected, onAnswerSelected, onNextQuestion }) {
  return (
    <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24">
      <div className="flex max-w-screen-md overflow-hidden bg-white border rounded-lg shadow-md lg:flex-row sm:mx-auto">
        <div className="flex flex-col w-full justify-center p-2 md:p-6 bg-white">
          <div className="flex justify-between">
            <p className="px-3 py-1 text-xs font-medium tracking-wider text-purple-600 uppercase rounded-full bg-purple-200">
              {question.tag}
            </p>
            <p className="tracking-widest">1 / 10</p>
          </div>
          <h5 className="mb-3 mt-3 text-2xl font-medium leading-snug md:leading-none sm:text-4xl">
            {question.text}
          </h5>
        </div>
      </div>
      <div>
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
        {question.answers.map((answer, i) => (
          <Answer
            key={answer.id}
            text={answer.text}
            onClick={() => onAnswerSelected(answer)}
            status={getAnswerStatus(answer.id, selected, question.answer)}
          />
        ))}
      </div>
    </div>
  );
}

function Answer({ text, status, onClick }) {
  const classes = clsx(
    "flex w-full max-w-screen-md  border rounded-lg sm:mx-auto mt-4 :outlifocusne-none ",
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

function GameOver() {
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
                <h2 className="title-font font-medium text-3xl text-gray-900">7</h2>
                <p className="leading-relaxed">Correctas</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 px-6 py-4 rounded-lg bg-red-300 w-2/5">
              <div className="flex flex-col items-center">
                <h2 className="title-font font-medium text-3xl text-gray-900">7</h2>
                <p className="leading-relaxed">Incorrectas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function playReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const currentQuestion = state.questions.shift();
      return {
        ...state,
        status: "PLAYING",
        currentQuestion,
        questions: state.questions,
      };
    }

    case "ANSWER_SELECTED": {
      return {
        ...state,
        selected: action.selected,
      };
    }

    case "NEXT_QUESTION": {
      // No more questions left, game ended
      if (state.questions.length === 0) {
        return {
          ...state,
          selected: null,
          currentQuestion: null,
          status: "GAME_ENDED",
        };
      }

      const currentQuestion = state.questions.shift();
      return {
        ...state,
        selected: null,
        currentQuestion,
        questions: state.questions,
      };
    }
    default: {
      throw new Error(`Unhandled action type ${action.type}`);
    }
  }
}

const answers = Array.from({ length: 4 }).map((x, i) => ({
  id: i,
  text: `Respuesta número ${i}, que puede ser larga para ver qué onda`,
}));
const question = {
  text: "Un texto con la pregunta",
  answers,
  tag: "Cocina",
  answer: answers[3].id,
};

const question2 = {
  text: "Un texto 2 con la pregunta",
  answers,
  tag: "Cocina",
  answer: answers[1].id,
};

function Play() {
  const [state, dispatch] = React.useReducer(playReducer, {
    status: "NOT_STARTED",
    questions: [question, question2, question, question2],
    currentQuestion: null,
    selected: null,
  });

  function onAnswerSelected(selected) {
    return dispatch({ type: "ANSWER_SELECTED", selected });
  }

  console.log(state);

  if (state.status === "NOT_STARTED") {
    return (
      <Layout>
        <Welcome startGame={() => dispatch({ type: "START_GAME" })} />
      </Layout>
    );
  }

  if (state.status === "PLAYING") {
    return (
      <Layout>
        <MultipleChoiceQuestion
          question={state.currentQuestion}
          onAnswerSelected={onAnswerSelected}
          onNextQuestion={() => dispatch({ type: "NEXT_QUESTION" })}
          selected={state.selected}
        />
      </Layout>
    );
  }

  if (state.status === "GAME_ENDED") {
    return (
      <Layout>
        <GameOver />
      </Layout>
    );
  }
}

export default Play;
