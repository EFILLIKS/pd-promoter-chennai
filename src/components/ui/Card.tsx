import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden
        ${glass 
          ? "bg-white/[0.02] border-white/5 backdrop-blur-xl" 
          : "bg-neutral-900 border-neutral-800"
        }
        ${hoverEffect 
          ? "hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5" 
          : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
