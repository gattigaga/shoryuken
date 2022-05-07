import React from "react";

type Props = JSX.IntrinsicElements["button"] & {
  backgroundColor?: string[];
  textColor?: string;
};

const Button: React.FC<Props> = ({
  className,
  children,
  backgroundColor = ["bg-blue-700", "bg-blue-800"],
  textColor = "text-white",
  ...rest
}) => {
  return (
    <button
      className={`${backgroundColor[0]} ${textColor} px-3 py-3 rounded font-sans text-xs font-semibold outline-blue-400 hover:${backgroundColor[1]} disabled:bg-slate-200 disabled:text-slate-500 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
