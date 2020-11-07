import { useState } from "react";
import { FaCopy, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { useCopyToClipboard } from "react-use";
import Modal from "./Modal";
import RoundedButton from "./RoundedButton";

function ShareButton({ title = "Compartir", value }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(value);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <>
      <button
        title="Compartir"
        className="hover:bg-indigo-100 font-bold py-3 px-4 text-sm border border-indigo-500 text-indigo-600 shadow-xs rounded-md mr-2"
        onClick={() => setModalOpen(true)}
      >
        <FaShareAlt size="1em" />
      </button>
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} title={title}>
        <div className="px-12 py-5">
          <label className="block mb-2 font-medium">Link al juego</label>
          <div className="flex flex-wrap items-stretch w-full mb-2">
            <input
              type="text"
              className="block flex-grow leading-normal border h-12 border-grey-light rounded rounded-r-none px-3 relative"
              value={value}
              disabled
            />
            <div className="flex">
              <button
                onClick={handleCopy}
                className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                {showCopied ? "Copiado!" : "Copiar"}
                <FaCopy size="1em" className="ml-2" />
              </button>
            </div>
          </div>
          <p className="italic mt-1 text-gray-800 text-xs md:text-sm">
            Compartí este link para invitar a alguien a jugar.
          </p>
        </div>

        <div className="flex justify-center px-5 py-4 bg-gray-100 border-t border-gray-300">
          <RoundedButton
            id="share-whatsapp"
            Icon={FaWhatsapp}
            iconBgColor="bg-green-400"
            label="WhatsApp"
            onClick={() => window.open(`https://api.whatsapp.com/send?text=${value}`)}
          />
        </div>
      </Modal>
    </>
  );
}

export default ShareButton;
