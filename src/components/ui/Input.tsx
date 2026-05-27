import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 rounded-md border text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-200"
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}