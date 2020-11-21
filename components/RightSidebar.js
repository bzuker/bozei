import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import { useClickAway } from "react-use";
import useHideScroll from "../hooks/useHideScroll";

const variants = {
  opened: {
    right: 0,
    transition: { ease: "easeOut" },
  },
  closed: {
    right: "-66.6vw",
  },
};

function RightSidebar({ isOpen, onRequestClose, children }) {
  const navRef = useRef(null);
  useClickAway(navRef, onRequestClose);
  useHideScroll(isOpen);

  return (
    <div
      className={
        isOpen
          ? "items-center bg-gray-500 bottom-0 left-0 right-0 top-0 bg-opacity-50 fixed z-50 flex justify-center"
          : ""
      }
    >
      <motion.nav
        ref={navRef}
        initial={false}
        variants={variants}
        animate={isOpen ? "opened" : "closed"}
        className="top-0 right-0 fixed bg-white w-2/3 z-50 h-full overflow-auto"
      >
        <div className="relative">
          <button
            onClick={onRequestClose}
            className={clsx([
              "text-xl md:text-4xl absolute top-0 right-0",
              "focus:outline-none focus:shadow-outline",
              "hover:bg-indigo-200 rounded-full",
              "duration-300 ease-in-out transition mt-2 mr-2 p-1",
            ])}
            id="close-sidebar"
          >
            <FiX color="gray" />
          </button>
        </div>
        {isOpen && children}
      </motion.nav>
    </div>
  );
}

export default RightSidebar;
