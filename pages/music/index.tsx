import React from "react";
import Layout from "../../components/layout";
import { LoginModal } from "../../components/login/LoginModal";

const CTA = ({ tag, title, description, button }) => (
  <div className="flex flex-col max-w-screen-lg overflow-hidden border rounded-lg md:shadow-xl lg:flex-row sm:mx-auto md:mx-5 bg-white">
    <div className="flex flex-col justify-center p-8 lg:p-10">
      <div>
        <p className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-purple-600 uppercase bg-purple-200 rounded-full">
          {tag}
        </p>
      </div>
      <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
        {title}
      </h5>
      <p className="py-5 mb-5 text-gray-800">{description}</p>
      <div className="flex items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 bg-purple-500 rounded-lg hover:bg-purple-700 focus:shadow-outline focus:outline-none"
        >
          {button}
        </button>
      </div>
    </div>
  </div>
);

const Index: React.FC<Props> = ({ ...props }) => {
  return (
    <Layout>
      <LoginModal isOpen={true} onClose={() => null} title="Ingresar" />
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 md:gap-0">
        <CTA
          tag="Jugá ahora!"
          title="Juego rápido"
          description="Elegí una categoría y desafiá a otros jugadores"
          button="Empezar"
        />
        <CTA
          tag="Creá tu juego!"
          title="Jugá con amigos"
          description="Armá tu juego y compartilo con tus amigos"
          button="Crear juego"
        />
      </div>
    </Layout>
  );
};

interface Props {}

export default Index;
