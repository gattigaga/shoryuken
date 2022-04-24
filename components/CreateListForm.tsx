import React, { useState, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";

type Props = {
  onRequestClose?: () => void;
  onSubmit?: (value: string) => void;
};

const CreateListForm: React.FC<Props> = ({ onRequestClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refInput.current?.focus();
  }, []);

  return (
    <div className="shrink-0 w-80 p-2 bg-slate-300 rounded">
      <input
        ref={refInput}
        className="w-full py-3 rounded text-xs border-slate-400 outline-blue-500 mb-2"
        type="text"
        name="title"
        placeholder="Enter list title..."
        value={title}
        maxLength={30}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          switch (event.key) {
            case "Enter":
              onSubmit?.(title);
              break;

            case "Escape":
              onRequestClose?.();
              break;

            default:
              break;
          }
        }}
      />
      <div className="flex items-center">
        <Button
          className="outline-black mr-2"
          type="button"
          onClick={() => onSubmit?.(title)}
        >
          Add list
        </Button>
        <button
          className="text-slate-500 hover:text-slate-600"
          type="button"
          onClick={onRequestClose}
        >
          <MdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default CreateListForm;
