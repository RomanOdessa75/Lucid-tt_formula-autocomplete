const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
