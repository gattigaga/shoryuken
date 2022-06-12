import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

import useCreateListMutation from "../hooks/lists/use-create-list-mutation";
import Button from "./Button";

type Props = {
  boardId: number;
  onRequestClose?: () => void;
};

const CreateListForm: React.FC<Props> = ({ boardId, onRequestClose }) => {
  const [title, setTitle] = useState("");
  const refInput = useRef<HTMLInputElement>(null);
  const createListMutation = useCreateListMutation();

  const createList = async () => {
    if (!title) return;

    onRequestClose?.();

    try {
      await createListMutation.mutateAsync({
        body: {
          title,
          board_id: boardId,
        },
      });
    } catch (error) {
      toast.error("Failed to create a list.");
    }
  };

  useEffect(() => {
    refInput.current?.focus();
  }, []);

  return (
    <div className="shrink-0 w-72 p-2 bg-slate-300 rounded">
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
              createList();
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
          onClick={createList}
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
