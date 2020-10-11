import Layout from "../components/layout";
import { FaFacebook } from "react-icons/fa";
import initFirebase from "../utils/auth/initFirebase";
import { signInWithGoogle } from "../utils/auth/signIn";
import { useRouter } from "next/router";
import { useUser } from "../context/Auth";

initFirebase();

function LoginButton({ text, icon, onClick }) {
  const router = useRouter();

  async function handleClick() {
    await onClick();
    router.push("/landing");
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

function Login() {
  const router = useRouter();
  const { user, userLoading } = useUser();

  return (
    <Layout>
      <div className="flex items-center justify-center sm:px-6 md:pt-16">
        <div className="w-full max-w-md p-4 bg-white rounded-md shadow-xl border border-gray-300">
          <div className="flex items-center justify-center">
            <span className="text-xl font-medium text-gray-900">Ingresar</span>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
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
              onClick={signInWithGoogle}
            />
            <LoginButton
              text="Continuar con Facebook"
              icon={<FaFacebook size={"1.5em"} className="mr-3" />}
            />
            <div className="w-full my-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>

              <a href="#" className="text-sm text-center text-gray-500 uppercase hover:underline">
                o continuar con mail
              </a>

              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <label htmlFor="email" className="block">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                className="block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input focus:border-indigo-600"
                required
              />
            </label>
            <div className="w-2/3 mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SignIn() {
  return (
    <form className="mt-4">
      <label htmlFor="email" className="block">
        <span className="text-sm text-gray-700">Email</span>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="username"
          className="block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input focus:border-indigo-600"
          required
        />
      </label>
      <label htmlFor="password" className="block mt-3">
        <span className="text-sm text-gray-700">Password</span>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          className="block w-full px-3 py-2 mt-1 text-gray-700 border rounded-md form-input focus:border-indigo-600"
          required
        />
      </label>
      <div className="flex items-center justify-between mt-4">
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" className="text-indigo-600 border form-checkbox" />
            <span className="mx-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>
        <div>
          <a className="block text-sm text-indigo-700 fontme hover:underline" href="#">
            Forgot your password?
          </a>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}

export default Login;
