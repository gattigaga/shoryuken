import { FC } from "react";

type Props = JSX.IntrinsicElements["input"] & {
  errorMessage?: string;
  isError?: boolean;
};

const Input: FC<Props> = ({ className, errorMessage, isError, ...rest }) => {
  return (
    <>
      <input
        className={`rounded border-2 border-slate-200 bg-white px-2 py-2 font-sans text-xs outline-blue-500 disabled:bg-slate-100 ${className}`}
        {...rest}
      />
      {isError && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
    </>
  );
};

export default Input;
