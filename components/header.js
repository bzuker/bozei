import Link from "next/link";
import { useUser } from "../context/Auth";
import { useClickAway } from "react-use";
import { useRef, useState } from "react";

function Avatar({ photoURL, logout }) {
  const ref = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  useClickAway(ref, () => setShowSettings(false));

  return (
    <div className="z-40">
      <button
        type="button"
        className="flex items-center focus:outline-none"
        aria-label="toggle profile dropdown"
        onClick={() => setShowSettings(true)}
      >
        <div className="h-10 w-10 overflow-hidden rounded-full border-2">
          <img
            src={photoURL || "tailwind-logo.svg"}
            className="h-full w-full object-cover"
            alt="avatar"
          />
        </div>
      </button>
      {showSettings && (
        <div
          ref={ref}
          className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl border border-gray-300"
        >
          <a href="#" className="block px-4 py-2 text-sm capitalize hover:bg-indigo-200">
            your profile
          </a>
          <a href="#" className="block px-4 py-2 text-sm capitalize hover:bg-indigo-200">
            Your projects
          </a>
          <a href="#" className="block px-4 py-2 text-sm capitalize hover:bg-indigo-200">
            Help
          </a>
          <a href="#" className="block px-4 py-2 text-sm capitalize hover:bg-indigo-200">
            Settings
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm capitalize hover:bg-indigo-200"
            onClick={logout}
          >
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
}

function Header() {
  const { user, logout, loadingUser } = useUser();

  return (
    <header className="bg-white h-12 w-full relative z-50 border-b-2">
      <div className="container max-w-6xl mx-auto h-full flex justify-center sm:justify-between items-center px-8 xl:px-0">
        <a href="/" className="flex items-center h-5 relative font-black leading-none">
          <svg
            className="h-6 w-auto fill-current text-indigo-600"
            viewBox="0 0 194 116"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd">
              <path d="M96.869 0L30 116h104l-9.88-17.134H59.64l47.109-81.736zM0 116h19.831L77 17.135 67.088 0z" />
              <path d="M87 68.732l9.926 17.143 29.893-51.59L174.15 116H194L126.817 0z" />
            </g>
          </svg>
          <span className="text-xl ml-3 text-gray-800">
            Bozei<span className="text-pink-500">.</span>
          </span>
        </a>
        <nav
          id="nav"
          className="absolute left-0 w-full md:w-auto text-gray-800 flex-col md:flex-row h-64 md:h-24 justify-between text-sm lg:text-base bg-white md:bg-transparent top-0 mt-24 md:mt-0 border-t md:border-none border-gray-200 pt-5 md:py-0 z-50 hidden md:flex items-center md:relative"
        >
          <a
            href="#"
            className="font-bold ml-0 md:ml-12 mr-0 md:mr-3 lg:mr-8 transition-color duration-100 hover:text-indigo-600"
          >
            Juegos
          </a>
          <a
            href="#features"
            className="font-bold mr-0 md:mr-3 lg:mr-8 transition-color duration-100 hover:text-indigo-600"
          >
            Respuestas
          </a>
          <div className="md:hidden border-t border-gray-200 font-medium flex flex-col w-full">
            <Link href="/login">
              <a className="py-2 text-pink-500 w-full text-center font-bold">Ingresar</a>
            </Link>
            <a
              href="#_"
              className="px-5 py-3 fold-bold text-sm leading-none bg-indigo-700 text-white w-full inline-block text-center relative"
            >
              Comenzar
            </a>
          </div>
        </nav>
        <div className="absolute left-0 md:relative w-full md:w-auto md:bg-transparent border-b md:border-none border-gray-200 mt-48 md:mt-0 flex-col md:flex-row pb-8 md:p-0 justify-center items-center md:items-end hidden md:flex md:justify-between">
          {loadingUser || user ? (
            <Avatar photoURL={user?.photoURL} logout={logout} />
          ) : (
            <>
              <Link href="/login">
                <a className="px-3 md:px-3 py-2 text-sm text-pink-500 lg:text-white font-bold mr-0 sm:mr-3 relative z-40 md:mt-0">
                  Ingresar
                </a>
              </Link>
              <a
                href="#_"
                className="px-5 py-3 rounded fold-bold text-sm transition-all duration-300 leading-none bg-indigo-700 lg:bg-white text-white lg:text-indigo-700 w-auto sm:w-full h-full inline-block font-bold relative shadow-md lg:shadow-none hover:shadow-xl z-40"
              >
                Comenzar
              </a>
            </>
          )}
          <svg
            className="hidden lg:block absolute w-screen max-w-3xl -mt-64 -ml-12 left-0 top-0 z-10"
            viewBox="0 0 818 815"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="c">
                <stop stopColor="#E614F2" offset="0%" />
                <stop stopColor="#FC3832" offset="100%" />
              </linearGradient>
              <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="f">
                <stop stopColor="#657DE9" offset="0%" />
                <stop stopColor="#1C0FD7" offset="100%" />
              </linearGradient>
              <filter
                x="-4.7%"
                y="-3.3%"
                width="109.3%"
                height="109.3%"
                filterUnits="objectBoundingBox"
                id="a"
              >
                <feOffset dy={8} in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur
                  stdDeviation={8}
                  in="shadowOffsetOuter1"
                  result="shadowBlurOuter1"
                />
                <feColorMatrix
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                  in="shadowBlurOuter1"
                />
              </filter>
              <filter
                x="-4.7%"
                y="-3.3%"
                width="109.3%"
                height="109.3%"
                filterUnits="objectBoundingBox"
                id="d"
              >
                <feOffset dy={8} in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur
                  stdDeviation={8}
                  in="shadowOffsetOuter1"
                  result="shadowBlurOuter1"
                />
                <feColorMatrix
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                  in="shadowBlurOuter1"
                />
              </filter>
              <path
                d="M160.52 108.243h497.445c17.83 0 24.296 1.856 30.814 5.342 6.519 3.486 11.635 8.602 15.12 15.12 3.487 6.52 5.344 12.985 5.344 30.815v497.445c0 17.83-1.857 24.296-5.343 30.814-3.486 6.519-8.602 11.635-15.12 15.12-6.52 3.487-12.985 5.344-30.815 5.344H160.52c-17.83 0-24.296-1.857-30.814-5.343-6.519-3.486-11.635-8.602-15.12-15.12-3.487-6.52-5.343-12.985-5.343-30.815V159.52c0-17.83 1.856-24.296 5.342-30.814 3.486-6.519 8.602-11.635 15.12-15.12 6.52-3.487 12.985-5.343 30.815-5.343z"
                id="b"
              />
              <path
                d="M159.107 107.829H656.55c17.83 0 24.296 1.856 30.815 5.342 6.518 3.487 11.634 8.602 15.12 15.12 3.486 6.52 5.343 12.985 5.343 30.816V656.55c0 17.83-1.857 24.296-5.343 30.815-3.486 6.518-8.602 11.634-15.12 15.12-6.519 3.486-12.985 5.343-30.815 5.343H159.107c-17.83 0-24.297-1.857-30.815-5.343-6.519-3.486-11.634-8.602-15.12-15.12-3.487-6.519-5.343-12.985-5.343-30.815V159.107c0-17.83 1.856-24.297 5.342-30.815 3.487-6.519 8.602-11.634 15.12-15.12 6.52-3.487 12.985-5.343 30.816-5.343z"
                id="e"
              />
            </defs>
            <g fill="none" fillRule="evenodd" opacity=".9">
              <g transform="rotate(65 416.452 409.167)">
                <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                <use fill="url(#c)" xlinkHref="#b" />
              </g>
              <g transform="rotate(29 421.929 414.496)">
                <use fill="#000" filter="url(#d)" xlinkHref="#e" />
                <use fill="url(#f)" xlinkHref="#e" />
              </g>
            </g>
          </svg>
        </div>
        <div
          id="nav-mobile-btn"
          className="w-6 absolute block md:hidden right-0 top-0 mr-5 mt-2 sm:mt-4 z-50 cursor-pointer select-none"
        >
          <span className="w-full h-1 mt-2 sm:mt-1 bg-gray-800 rounded-full block transform duration-200" />
          <span className="w-full h-1 mt-1 bg-gray-800 rounded-full block  transform duration-200" />
        </div>
      </div>
    </header>
  );
}

export default Header;
