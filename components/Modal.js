import clsx from "clsx";
import React from "react";
import { FiX } from "react-icons/fi";
import ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

export default function Modal({ children, title, ...rest }) {
  return (
    <ReactModal
      {...rest}
      className="max-h-screen max-w-3xl outline-none w-full overflow-auto"
      overlayClassName="items-center bg-gray-500 bottom-0 left-0 right-0 top-0 bg-opacity-50 fixed z-50 flex justify-center"
    >
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-start justify-between text-lg md:text-xl">
          <h2 className="text-lg md:text-xl">{title}</h2>
          <button
            onClick={rest.onRequestClose}
            className={clsx([
              "text-lg",
              "focus:outline-none focus:shadow-outline",
              "duration-150 ease-in-out transition",
            ])}
            id="close-modal"
          >
            <FiX color="gray" />
          </button>
        </div>
        {children}
      </div>
    </ReactModal>
  );
}
