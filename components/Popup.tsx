import React from "react";
import { MdClose } from "react-icons/md";

type Props = {
  title: string;
  children?: any;
  isOpen?: boolean;
  onClickClose?: () => void;
};

const Popup: React.FC<Props> = ({ title, children, isOpen, onClickClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 border rounded shadow w-72 bg-white px-3 pb-4">
      <div className="h-10 border-b flex items-center justify-between">
        <div className="w-4" />
        <p className="text-xs text-slate-500">{title}</p>
        <button
          className="text-sm text-slate-500 w-4 h-6 flex items-center justify-center"
          type="button"
          onClick={onClickClose}
        >
          <MdClose size={16} />
        </button>
      </div>
      <div className="pt-3">{children}</div>
    </div>
  );
};

export default Popup;
