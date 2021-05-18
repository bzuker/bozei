import { useState } from "react";
import { FaFacebook, FaRandom, FaSalesforce } from "react-icons/fa";
import { useToggle } from "react-use";
import { useUser } from "../../context/Auth";

function LoginButton({ text, icon, onClick }) {
  async function handleClick() {
    await onClick();
  }
  return (
    <button
      className="w-full sm:w-2/3 px-6 py-3 border border-gray-400 rounded shadow text-center hover:bg-indigo-200 my-1 inline-flex"
      onClick={handleClick}
    >
      {icon}
      {text}
    </button>
  );
}

function getRandomUsername(): string {
  const names = [
    "Maradona",
    "Fangio",
    "Mirtha Legrand",
    "Borges",
    "Charly Garcia",
    "Milito",
    "Cerati",
    "Luca Prodan",
    "Indio Solari",
    "Fabi Cantilo",
    "Messi",
    "Mercedes Sosa",
    "Spinetta",
    "Soledad",
    "Vicentico",
    "Fito Paez",
    "Abel Pintos",
    "Aznar",
    "Piazzolla",
    "Bizarrap",
  ];
  return `${names[Math.floor(Math.random() * names.length)]} ${Math.round(
    Math.random() * 100
  )}`;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({
  onLoginCompleted,
  ...props
}) => {
  const { signInAnonymously, signInWithGoogle } = useUser();
  const [displayName, setDisplayName] = useState(getRandomUsername());
  const [isLoading, toggle] = useToggle(false);
  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full">
      <LoginButton
        text="Continuar con Google"
        icon={
          <svg className="h-6 w-6 mr-3" viewBox="0 0 40 40">
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#FFC107"
            />
            <path
              d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
              fill="#FF3D00"
            />
            <path
              d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
              fill="#4CAF50"
            />
            <path
              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
              fill="#1976D2"
            />
          </svg>
        }
        onClick={async () => {
          const user = await signInWithGoogle();
          onLoginCompleted(user);
        }}
      />
      <LoginButton
        text="Continuar con Facebook"
        icon={<FaFacebook size={"1.5em"} className="mr-3" />}
        onClick={() => alert("No está listo todavía")}
      />
      <div className="w-full my-4 flex items-center justify-between">
        <span className="border-b w-1/5 lg:w-1/4"></span>

        <div className="text-sm text-center text-gray-500 uppercase cursor-default">
          o continuar sin usuario
        </div>

        <span className="border-b w-1/5 lg:w-1/4"></span>
      </div>
      <form
        className="flex flex-col justify-center items-center w-full sm:w-2/3"
        onSubmit={async (evt) => {
          evt.preventDefault();
          toggle(true);
          const user = await signInAnonymously(displayName);
          onLoginCompleted(user);
        }}
      >
        <label htmlFor="displayName" className="w-full">
          <span className="text-gray-700">Nombre</span>
          <div className="flex w-full my-2">
            <input
              type="text"
              id="displayName"
              name="displayName"
              autoComplete="off"
              className="relative h-12 w-full bg-white border border-gray-300 border-r-0 rounded-l-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none sm:text-sm md:text-base"
              value={displayName}
              onChange={(evt) => setDisplayName(evt.target.value)}
              required
            />
            <div className="flex">
              <button
                type="button"
                onClick={() => setDisplayName(getRandomUsername())}
                className="flex items-center rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <FaRandom size="1em" />
              </button>
            </div>
          </div>
        </label>
        <div className="w-full mt-6">
          <button
            type="submit"
            className="w-full px-4 py-3 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center space-x-2 animate-pulse py-1 px-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            ) : (
              <div>Ingresar</div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface LoginComponentProps {
  onLoginCompleted: (user) => void;
}
