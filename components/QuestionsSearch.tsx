import { MutableRefObject, useEffect, useRef, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";
import useSWR from "swr";
import { TAGS } from "../utils/constants";
import fetcher from "../utils/fetcher";
import { QuestionItem } from "./QuestionItem";
import { Question } from "../interfaces/game";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

interface QuestionSearchProps {
  existingQuestions: Array<Question>;
  onQuestionAdd: (q: Question) => void;
}

const searchQuestions = (text: string, page: number) => {
  return fetcher(`/api/questions/search?text=${text}&page=${page}`);
};

export function QuestionsSearch({ existingQuestions, onQuestionAdd }: QuestionSearchProps) {
  const [searchText, setSearchText] = useState("");
  const [questions, setQuestions] = useState({
    items: null,
    page: 0,
    nbPages: null,
    showMore: false,
  });
  const { ref, inView, entry } = useInView({ threshold: 0 });

  // Initial search
  useEffect(() => {
    if (!searchText) {
      return;
    }

    const handleSearch = async () => {
      const result = await searchQuestions(searchText, 0);
      setQuestions((prevState) => ({
        ...prevState,
        items: result.hits as Question[],
        nbPages: result.nbPages,
      }));
    };

    handleSearch();
  }, [searchText]);

  // Search more elements when user scrolls to bottom
  useEffect(() => {
    const loadMore = async () => {
      const result = await searchQuestions(searchText, questions.page + 1);
      setQuestions((prevState) => ({
        ...prevState,
        items: [...prevState.items, ...(result.hits as Question[])],
        page: prevState.page + 1,
        showMore: false,
      }));
    };

    if (!questions.showMore || !searchText) {
      return;
    }

    loadMore();
  }, [searchText, questions.showMore]);

  useEffect(() => {
    if (inView) {
      return setQuestions((prevState) => ({
        ...prevState,
        showMore: prevState.page + 1 < prevState.nbPages,
      }));
    }
  }, [inView]);

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
        <div className="flex flex-col mt-4">
          <ul className="w-full">
            {questions.items?.map((q) => {
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
                          alreadyAdded
                            ? "bg-blue-700 cursor-default"
                            : "bg-blue-400 hover:bg-blue-600"
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
          {questions.items?.length > 0 && <div ref={ref}>No hay más resultados</div>}
          {searchText && questions.items?.length === 0 && "No se encontraron resultados"}
        </div>
      </div>
    </div>
  );
}
