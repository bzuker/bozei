import Layout from "../components/layout";
import { FaEnvelope, FaFacebook, FaGoogle } from 'react-icons/fa'

function LoginButton({ text, icon }) {
  return (
    <button className="w-full sm:w-2/3 px-6 py-3 border border-gray-400 rounded shadow text-center rounded-md hover:bg-gray-200 my-1 inline-flex">
      {icon}
      {text}
    </button>
  );
}

function Login() {
  return (
    <Layout>
      <div className="flex items-center justify-center sm:px-6">
        <div className="w-full max-w-md p-4 bg-white rounded-md shadow-xl border border-gray-300">
          <div className="flex items-center justify-center">
            <span className="text-xl font-medium text-gray-900">Ingresar</span>
          </div>
          <form className="mt-4">
            <div className="flex flex-col items-center justify-center mt-4">
              <LoginButton text="Continuar con Google" icon={<FaGoogle size={'1.5em'} className='mr-3' />} />
              <LoginButton text="Continuar con Facebook" icon={<FaFacebook size={'1.5em'} className='mr-3' />} />
              <LoginButton text="Continuar con Mail" icon={<FaEnvelope size={'1.5em'} className='mr-3' />} />
            </div>
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
                  <input
                    type="checkbox"
                    className="text-indigo-600 border form-checkbox"
                  />
                  <span className="mx-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
              </div>
              <div>
                <a
                  className="block text-sm text-indigo-700 fontme hover:underline"
                  href="#"
                >
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
        </div>
      </div>
    </Layout>
  );
}

export default Login;
