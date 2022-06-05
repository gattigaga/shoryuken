import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

import useUpdateCheckMutation from "../hooks/checks/use-update-check-mutation";
import Button from "./Button";

type Props = {
  id: number;
  cardId: number;
  content: string;
  isChecked?: boolean;
};

const CardCheckItem: React.FC<Props> = ({ id, cardId, content, isChecked }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkContent, setCheckContent] = useState(content);
  const refContentInput = useRef<HTMLTextAreaElement>(null);
  const updateCheckMutation = useUpdateCheckMutation();

  const updateContent = async (content: string) => {
    if (!content) return;

    try {
      await updateCheckMutation.mutateAsync({
        id,
        cardId,
        body: {
          content,
        },
      });
    } catch (error) {
      toast.error("Failed to update check item content.");
    }
  };

  const handleContentHeight = () => {
    if (!refContentInput.current) return;

    refContentInput.current.style.height = "64px";

    refContentInput.current.style.height =
      refContentInput.current.scrollHeight + "px";
  };

  // Set focus on check content input if in editing mode.
  useEffect(() => {
    if (isEditing) {
      refContentInput.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setCheckContent(content);
  }, [content]);

  return (
    <div className="ml-[-0.5rem]">
      {/* Static mode */}
      {!isEditing && (
        <div className="flex p-2 rounded cursor-pointer hover:bg-slate-200">
          <div className="w-9">
            <input
              className="rounded border-2 border-slate-300 w-5 h-5"
              type="checkbox"
              checked={isChecked}
            />
          </div>
          <button
            className="text-xs text-slate-700 break-all mt-[0.25rem] w-full text-left"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            {checkContent}
          </button>
        </div>
      )}

      {/* Editing mode */}
      {isEditing && (
        <div className="flex p-2 rounded cursor-pointer hover:bg-slate-200">
          <div className="w-9">
            <input
              className="rounded border-2 border-slate-300 w-5 h-5"
              type="checkbox"
              checked={isChecked}
            />
          </div>
          <div className="w-full">
            <textarea
              ref={refContentInput}
              className="text-xs text-slate-700 w-full h-16 rounded border-slate-300 bg-slate-200"
              value={checkContent}
              onChange={(event) => setCheckContent(event.target.value)}
              onKeyDown={(event) => {
                switch (event.key) {
                  case "Enter":
                    event.preventDefault();
                    setIsEditing(false);
                    updateContent(checkContent);
                    break;

                  case "Escape":
                    setIsEditing(false);
                    setCheckContent(content);
                    break;

                  default:
                    break;
                }
              }}
              onInput={handleContentHeight}
            />
            <div className="flex items-center">
              <Button
                className="outline-black mr-2"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  updateContent(checkContent);
                }}
              >
                Save
              </Button>
              <button
                className="text-slate-500 hover:text-slate-600"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCheckContent(content);
                }}
              >
                <MdClose size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCheckItem;
