import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
  endIconAriaLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium ml-1 text-slate-400">
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
            w-full bg-brand-acento border border-gray-200 rounded-lg px-3 py-2.5 
            ${icon ? "pl-10" : ""} 
            ${endIcon ? "pr-10" : ""}
            text-slate-800 placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
            transition-all duration-200
            ${className}
            ${error ? "border-red-500 bg-red-950/10 text-red-100 placeholder:text-red-300/80 shadow-[0_0_0_3px_rgba(239,68,68,0.2)] focus:ring-red-500/50 focus:border-red-500" : ""}
          `}
          {...props}
        />
        {endIcon && (
          <button
            type="button"
            aria-label={endIconAriaLabel ?? "Accion de campo"}
            onClick={onEndIconClick}
            disabled={props.disabled || !onEndIconClick}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none ${
              error
                ? "text-red-400 hover:text-red-300 focus-visible:text-red-300"
                : "text-slate-500 hover:text-slate-300 group-focus-within:text-indigo-400"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {endIcon}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
};
