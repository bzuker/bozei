import React from "react";

function playReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const currentQuestion = state.questions.shift();
      return {
        ...state,
        status: "PLAYING",
        currentQuestion,
        questions: state.questions,
        currentIndex: 1,
      };
    }

    case "ANSWER_SELECTED": {
      const isCorrect = state.currentQuestion.correctAnswerId === action.selected.id;
      return {
        ...state,
        selected: action.selected,
        correctGuesses: isCorrect ? state.correctGuesses + 1 : state.correctGuesses,
      };
    }

    case "NEXT_QUESTION": {
      // No more questions left, game ended
      if (state.questions.length === 0) {
        return {
          ...state,
          selected: null,
          currentQuestion: null,
          currentIndex: null,
          status: "GAME_ENDED",
        };
      }

      const currentQuestion = state.questions.shift();
      return {
        ...state,
        selected: null,
        currentQuestion,
        questions: state.questions,
        currentIndex: state.currentIndex + 1,
      };
    }

    default: {
      throw new Error(`Unhandled action type ${action.type}`);
    }
  }
}

function useGameplay(game) {
  const [state, dispatch] = React.useReducer(playReducer, {
    gameId: game.id,
    status: "NOT_STARTED",
    questions: [...game.questions],
    currentQuestion: null,
    currentIndex: 0,
    correctGuesses: 0,
    selected: null,
  });

  const startGame = () => dispatch({ type: "START_GAME" });
  const nextQuestion = () => dispatch({ type: "NEXT_QUESTION" });
  const onAnswerSelected = (selected) => {
    if (state.selected) {
      return;
    }

    dispatch({ type: "ANSWER_SELECTED", selected });
  };

  return {
    gameState: state,
    totalQuestions: game.questions.length,
    startGame,
    onAnswerSelected,
    nextQuestion,
  };
}

export default useGameplay;
