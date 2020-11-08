const { useEffect } = require("react");

function useHideScroll(isOpen) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);
}

export default useHideScroll;
