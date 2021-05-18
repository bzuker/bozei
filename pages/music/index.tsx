import { useRouter } from "next/router";
import React from "react";
import { useToggle } from "react-use";
import Layout from "../../components/layout";
import { LoginModal } from "../../components/login/LoginModal";
import { useUser } from "../../context/Auth";
import { CallType } from "../../models/Room";
import fetcher from "../../utils/fetcher";

const CTA = ({
  tag,
  title,
  description,
  button,
  onButtonClick = () => null,
}) => {
  const [loading, toggle] = useToggle(false);
  return (
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
            onClick={async () => {
              toggle(true);
              await onButtonClick();
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex space-x-2 animate-pulse py-1 px-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            ) : (
              button
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const getRandomRoomId = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

async function createMusicRoom(roomId: string, user) {
  const result = await fetcher(`/api/music/${roomId}`, {
    method: "POST",
    body: JSON.stringify({ type: CallType.CREATE, user }),
    headers: { "Content-Type": "application/json" },
  });

  return result;
}

const Index: React.FC<Props> = ({ ...props }) => {
  const router = useRouter();
  const [isOpen, toggle] = useToggle(false);
  const { user } = useUser();

  const createRoomAndGo = async (user) => {
    if (!user) {
      console.log("User not found", user);
      return;
    }
    const roomId = getRandomRoomId();
    await createMusicRoom(roomId, user);
    router.push(`/music/room/${roomId}`);
  };

  return (
    <Layout>
      <LoginModal
        isOpen={isOpen}
        onClose={() => toggle(false)}
        title="Ingresar"
        onLoginCompleted={(user) => createRoomAndGo(user)}
      />
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
          onButtonClick={async () => {
            if (!user) {
              return toggle(true);
            }

            await createRoomAndGo(user);
          }}
        />
      </div>
    </Layout>
  );
};

interface Props {}

export default Index;
