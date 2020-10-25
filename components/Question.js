import { v4 as uuid } from "uuid";
import { useFieldArray, useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

function AnswerOption({ answerOption, remove, prefix, register, clearErrors, error = {} }) {
  return (
    <div className="mb-2 md:mb-4">
      <div className="flex items-center ">
        <button type="button" onClick={remove} className="mr-2 text-red-500" tabIndex="-1">
          <FaTimes />
        </button>
        <textarea
          className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500 overflow-y-hidden"
          type="text"
          placeholder="Respuesta"
          name={`${prefix}.text`}
          ref={register({ required: true })}
          defaultValue={answerOption.text}
        />
        <input
          type="checkbox"
          className="ml-5 form-checkbox text-green-500 p-2 md:p-3 border-2 border-gray-500"
          name={`${prefix}.isCorrect`}
          ref={register()}
          defaultChecked={answerOption.isCorrect}
          onChange={() => clearErrors("markCorrect")}
        />
      </div>
      {error.text && <p className="text-red-500 mt-1">No pusiste respuesta!</p>}
    </div>
  );
}

export function Question({ question, onSave }) {
  const { control, register, errors, setError, clearErrors, handleSubmit } = useForm({
    defaultValues: question || {
      text: "",
      answers: [{ text: "" }, { text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit = (questionData) => {
    const markedAsCorrect = questionData.answers.filter((x) => x.isCorrect);
    if (markedAsCorrect.length === 0) {
      setError("markCorrect", {
        type: "manual",
        message: "No marcaste ninguna respuesta como correcta!",
      });
      return;
    }

    if (markedAsCorrect.length > 1) {
      setError("markCorrect", {
        type: "manual",
        message: "Hay más de una respuesta correcta!",
      });
      return;
    }

    onSave({ id: question?.id || uuid(), ...questionData });
  };

  return (
    <form className="flex flex-wrap m-3 -mx-3 py-2 relative" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full md:w-2/3 px-3 mb-6 md:mb-3">
        <label className="block mb-2 font-bold tracking-wide text-gray-700">Texto</label>
        <textarea
          className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500 text-sm md:text-base"
          type="text"
          placeholder="Una pregunta para contestar"
          ref={register({ required: true })}
          name="text"
        />
        {errors.text && <p className="text-red-500 mt-2">No pusiste pregunta!</p>}
      </div>
      <div className="w-full px-3 md:w-2/3">
        <div className="flex justify-between">
          <label className="mb-2 font-bold tracking-wide text-gray-700">Respuestas</label>
          <label className="mb-2 font-bold tracking-wide text-gray-700">Es Correcta?</label>
        </div>
        {fields.map((answer, i) => (
          <AnswerOption
            key={answer.id}
            prefix={`answers[${i}]`}
            register={register}
            remove={() => (fields.length > 1 ? remove(i) : null)}
            answerOption={answer}
            error={errors?.answers?.[i]}
            clearErrors={clearErrors}
          />
        ))}
        <button
          type="button"
          onClick={append}
          className="text-gray-700 px-3 py-1 underline"
          tabIndex="-1"
        >
          Agregar respuesta
        </button>
      </div>
      {errors.markCorrect && <p className="text-red-500 ml-6 mt-1">{errors.markCorrect.message}</p>}
      <div className="flex w-full ml-5 mt-4">
        <button
          type="submit"
          className="inline-flex items-center px-12 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md hover:bg-green-500 active:bg-green-700"
          tabIndex="0"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
