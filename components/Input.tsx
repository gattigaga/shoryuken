import React from "react";

type Props = JSX.IntrinsicElements["input"];

const Input: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <input
      className={`rounded border-2 border-slate-200 bg-white px-2 py-2 font-sans text-xs outline-blue-500 ${className}`}
      {...rest}
    />
  );
};

export default Input;
