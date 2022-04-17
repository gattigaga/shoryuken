import React from "react";

type Props = JSX.IntrinsicElements["button"];

const Button: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <button
      className={`bg-blue-700 text-white px-2 py-3 rounded font-sans text-xs font-semibold outline-blue-400 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-500 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
