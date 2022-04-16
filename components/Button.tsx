import React from "react";

type Props = JSX.IntrinsicElements["button"];

const Button: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <button
      className={`bg-blue-700 text-white px-2 py-3 rounded font-sans text-xs font-semibold outline-blue-400 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
