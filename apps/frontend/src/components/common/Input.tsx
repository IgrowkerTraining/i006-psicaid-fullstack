import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          className={`text-sm font-medium ml-1 ${
            error ? "text-red-400" : "text-slate-400"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
              error
                ? "text-red-400 group-focus-within:text-red-400"
                : "text-slate-500 group-focus-within:text-indigo-400"
            }`}
          >
            {icon}
          </div>
        )}
        <input
          aria-invalid={!!error}
          className={`
            w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 
            ${icon ? "pl-10" : ""} 
            text-slate-200 placeholder:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
            transition-all duration-200
            ${className}
            ${error ? "border-red-500 bg-red-950/10 text-red-100 placeholder:text-red-300/80 shadow-[0_0_0_3px_rgba(239,68,68,0.2)] focus:ring-red-500/50 focus:border-red-500" : ""}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
};
