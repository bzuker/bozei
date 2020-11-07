import clsx from "clsx";

export default function RoundedButton({
  id,
  Icon,
  imageURL,
  imageAlt,
  iconBgColor,
  label,
  onClick,
}) {
  return (
    <button
      className={clsx([
        "flex flex-col items-center justify-center mx-2 p-1 outline-none rounded text-center",
        "focus:outline-none focus:shadow-outline",
        "duration-150 ease-in-out transition",
      ])}
      onClick={onClick}
      id={id}
    >
      <div
        className={clsx([
          "h-16 flex items-center justify-center p-2 rounded-full w-16",
          iconBgColor,
        ])}
      >
        {Icon && <Icon className="text-3xl text-white" />}
        {imageURL && <img src={imageURL} alt={imageAlt} className="block" />}
      </div>
      {label && <p className="mt-1">{label}</p>}
    </button>
  );
}
