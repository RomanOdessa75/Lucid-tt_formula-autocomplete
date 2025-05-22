import { forwardRef } from "react";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
