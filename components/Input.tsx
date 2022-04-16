import React from "react";

type Props = React.HTMLProps<HTMLInputElement>;

const Input: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <input
      className={`border-2 border-gray-200 bg-white px-2 py-2 font-sans text-xs outline-blue-400 ${className}`}
      {...rest}
    />
  );
};

export default Input;
