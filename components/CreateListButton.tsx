import React, { useState } from "react";
import { MdAdd } from "react-icons/md";

type Props = {
  onClick?: () => void;
};

const CreateListButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      className="shrink-0 px-4 w-80 h-12 bg-blue-500 rounded flex items-center hover:bg-blue-400"
      type="button"
      onClick={onClick}
    >
      <MdAdd color="white" size={24} />
      <p className="ml-2 text-xs text-white">Create new list</p>
    </button>
  );
};

export default CreateListButton;
