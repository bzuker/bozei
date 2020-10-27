import { FaTimes } from "react-icons/fa";

function FileUpload({ image, setImage }) {
  const handleImageChange = (event) => {
    const file =
      event.currentTarget.files && event.currentTarget.files.length
        ? event.currentTarget.files[0]
        : null;

    if (!file) {
      setImage("image", null);
      return;
    }

    setImage({
      preview: URL.createObjectURL(file),
      raw: file,
    });
  };

  if (image?.preview) {
    return (
      <div className="flex relative">
        <img className="px-6 pt-5 pb-6" src={image.preview} alt="image uploaded by user" />
        <button
          type="button"
          className="absolute border-2 bg-white rounded-full top-0 right-0 p-2 focus:outline-none focus:shadow-outline hover:bg-gray-200"
          onClick={() => setImage(null)}
        >
          <FaTimes />
        </button>
      </div>
    );
  }

  return (
    <label
      className="mt-2 mb-6 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
      htmlFor="image"
    >
      <input
        type="file"
        className="hidden"
        multiple={false}
        accept="image/x-png,image/jpeg,image/jpg"
        tabIndex={-1}
        onChange={handleImageChange}
        id="image"
      />
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
            Elegir un archivo
          </span>{" "}
          o arrastrarlo aquí
        </p>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
      </div>
    </label>
  );
}

export default FileUpload;
