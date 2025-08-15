import React from "react";

export const Button = ({ children, className, ...props }) => {
  return (
    <button className={`bg-blue-600 text-white rounded px-3 py-1 text-sm ${className}`} {...props}>
      {children}
    </button>
  );
};
