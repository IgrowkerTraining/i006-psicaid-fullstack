import { LoaderCircle } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    outline: "border border-slate-600 hover:bg-slate-800 text-slate-200",
    ghost: "hover:bg-slate-800 text-slate-300",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin h-5 w-5 mr-2 text-white" />
      ) : null}
      {children}
    </button>
  );
};
