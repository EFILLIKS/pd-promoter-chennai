import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-sm font-medium text-[#1A1F2A] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#1A1F2A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0B1117] focus:ring-1 focus:ring-[#0B1117]/10 transition-all duration-300 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="block mt-1.5 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", rows = 4, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-sm font-medium text-[#1A1F2A] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#1A1F2A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0B1117] focus:ring-1 focus:ring-[#0B1117]/10 transition-all duration-300 resize-none ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="block mt-1.5 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
