import clsx from "clsx";

export function QuestionItem({ text, tags, actions, answers }) {
  return (
    <li className="border rounded-lg border-gray-300 mb-4">
      <div className="bg-gray-200 px-4 py-1 sm:px-4 sm:flex sm:flex-row-reverse">
        <div className="flex flex-wrap justify-between items-center w-full">
          <div className="flex items-center md:w-4/5 md:pb-0">
            <p>{text}</p>
            {tags?.map((tag) => (
              <span
                key={tag.value}
                className="hidden md:flex px-3 ml-2 text-xs font-medium tracking-wider text-blue-600 uppercase rounded-full bg-blue-200"
              >
                {tag.label}
              </span>
            ))}
          </div>
          <div>{actions}</div>
        </div>
      </div>
      <div className="flex flex-wrap p-2 md:px-4">
        {answers?.map((answer, i) => (
          <div key={i} className="flex items-center w-full md:w-1/2 mt-1">
            <div
              className={clsx(
                `w-5 h-5 rounded-full mr-2`,
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
