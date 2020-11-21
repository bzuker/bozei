import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";
import useSWR from "swr";
import { TAGS } from "../utils/constants";
import fetcher from "../utils/fetcher";
import { QuestionItem } from "./QuestionItem";
import { Question } from "../interfaces/game";
import clsx from "clsx";

interface QuestionSearchProps {
  existingQuestions: Array<Question>;
  onQuestionAdd: (q: Question) => void;
}

const useSearchQuestions = (text: string) => {
  const { data, error } = useSWR(text ? `/api/questions/search?text=${text}` : null, fetcher);
  const questions = data?.hits as Array<Question>;

  return {
    questions,
    isLoading: !error && !data,
    error,
  };
};

export function QuestionsSearch({ existingQuestions, onQuestionAdd }: QuestionSearchProps) {
  const [searchText, setSearchText] = useState("");
  const { questions, isLoading, error } = useSearchQuestions(searchText);

  return (
    <div className="flex flex-col p-0 md:p-6 mt-4">
      <h2 className="block mb-2 font-bold tracking-wide text-gray-700 text-lg">
        Agregar pregunta existente
      </h2>
      <div className="w-full">
        <CreatableSelect
          placeholder="Buscá preguntas por categoría o texto"
          options={TAGS.map((x) => ({ value: x, label: x }))}
          formatCreateLabel={(inputValue) => `Buscar '${inputValue}' entre las preguntas`}
          onChange={({ value }) => setSearchText(value)}
          autoFocus
        />
      </div>
      <div className="w-full mt-4 border-t">
        <div className="flex mt-4">
          <ul className="w-full">
            {questions?.map((q) => {
              const alreadyAdded = existingQuestions.some((question) => question.id === q.id);
              return (
                <QuestionItem
                  key={q.id}
                  text={q.text}
                  tags={q.tags}
                  answers={q.answers}
                  actions={
                    <>
                      <button
                        type="button"
                        className={clsx(
                          "inline-flex items-center text-white px-3 py-1 transition duration-150 ease-in-out border rounded-md",
                          alreadyAdded ? "bg-blue-700" : "bg-blue-400 hover:bg-blue-600"
                        )}
                        onClick={() => onQuestionAdd(q)}
                        disabled={alreadyAdded}
                      >
                        {alreadyAdded ? (
                          "Agregada!"
                        ) : (
                          <>
                            <FaPlusSquare size="1em" className="mr-2" /> Agregar
                          </>
                        )}
                      </button>
                    </>
                  }
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
