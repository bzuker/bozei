export const Input: React.FC<InputProps> = ({
  type,
  name,
  label,
  ...props
}) => {
  return (
    <div className="relative border-b-2 focus-within:border-blue-500">
      <input
        type={type}
        name={name}
        autoComplete="off"
        placeholder=" "
        className="block w-full pl-0 focus:outline-none bg-transparent border-none focus:border-transparent focus:ring-0"
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute top-2 duration-300 origin-0 text-gray-500"
      >
        {label}
      </label>
    </div>
  );
};

interface InputProps {
  type: string;
  name: string;
  label: string;
}
