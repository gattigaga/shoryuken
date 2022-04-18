import React from "react";

type Props = {
  onClick?: () => void;
};

const CreateBoardButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      className="p-4 h-32 bg-slate-200 rounded hover:bg-slate-300"
      type="button"
      onClick={onClick}
    >
      <p className="text-md text-slate-500">Create new board</p>
    </button>
  );
};

export default CreateBoardButton;
