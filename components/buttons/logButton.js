import React from "react";

const LogButton = ({ children }) => {
  return (
    <button className="bg-primary px-3 py-2 rounded-lg text-white">
      {children}
    </button>
  );
};

export default LogButton;
