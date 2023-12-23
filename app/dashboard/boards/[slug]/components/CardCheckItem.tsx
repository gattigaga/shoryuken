"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";

import useUpdateCheckMutation from "../../../../../hooks/checks/use-update-check-mutation";
import useDeleteCheckMutation from "../../../../../hooks/checks/use-delete-check-mutation";
import Button from "../../../../components/Button";

type Props = {
  id: number;
  index: number;
  listId: number;
  cardId: number;
  content: string;
  isChecked?: boolean;
};

const CardCheckItem: React.FC<Props> = ({
  id,
  index,
  listId,
  cardId,
  content,
  isChecked,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkContent, setCheckContent] = useState(content);
  const refContentInput = useRef<HTMLTextAreaElement>(null);
  const updateCheckMutation = useUpdateCheckMutation();
  const deleteCheckMutation = useDeleteCheckMutation();

  const updateCheck = async () => {
    try {
      await updateCheckMutation.mutateAsync({
        id,
        listId,
        cardId,
        body: {
          is_checked: !isChecked,
        },
      });
    } catch (error) {
      toast.error("Failed to update check item.");
    }
  };

  const updateContent = async (content: string) => {
    if (!content) return;

    try {
      await updateCheckMutation.mutateAsync({
        id,
        cardId,
        listId,
        body: {
          content,
        },
      });
    } catch (error) {
      toast.error("Failed to update check item content.");
    }
  };

  const deleteItem = async () => {
    try {
      await deleteCheckMutation.mutateAsync({
        id,
        cardId,
      });
    } catch (error) {
      toast.error("Failed to delete check item.");
    }
  };

  const handleContentHeight = () => {
    if (!refContentInput.current) return;

    refContentInput.current.style.height = "64px";

    refContentInput.current.style.height =
      refContentInput.current.scrollHeight + "px";
  };

  // Set focus on check content input if in editing mode.
  // And set input auto height/
  useEffect(() => {
    if (isEditing) {
      refContentInput.current?.select();
      handleContentHeight();
    }
  }, [isEditing]);

  useEffect(() => {
    setCheckContent(content);
  }, [content]);

  return (
    <Draggable
      draggableId={`check-${id}`}
      index={index}
      isDragDisabled={isEditing}
    >
      {(provided, snapshot) => {
        // Used for fixing offset when dragging.
        if (snapshot.isDragging && provided.draggableProps.style) {
          const dragStyle: any = provided.draggableProps.style;

          dragStyle.left = dragStyle.offsetLeft;
          dragStyle.top = dragStyle.offsetTop;
        }

        return (
          <div
            ref={provided.innerRef}
            className={classnames("ml-[-0.5rem] rounded", {
              "shadow-xl": snapshot.isDragging,
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {/* Static mode */}
            {!isEditing && (
              <div className="group flex p-2 pr-0 rounded cursor-pointer bg-slate-100 hover:bg-slate-200">
                <div className="w-10">
                  <input
                    className="rounded border-2 border-slate-300 w-5 h-5"
                    type="checkbox"
                    checked={isChecked}
                    onChange={updateCheck}
                  />
                </div>
                <p
                  className="text-xs text-slate-700 break-all mt-[0.25rem] w-full text-left"
                  onClick={() => setIsEditing(true)}
                >
                  {checkContent}
                </p>
                <button
                  className="text-slate-100 group-hover:text-slate-500 w-8 h-6 ml-4"
                  type="button"
                  onClick={deleteItem}
                >
                  <MdClose size={20} />
                </button>
              </div>
            )}

            {/* Editing mode */}
            {isEditing && (
              <div className="flex p-2 rounded cursor-pointer hover:bg-slate-200">
                <div className="w-10">
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
                          event.stopPropagation();
                          setIsEditing(false);
                          setCheckContent(content);
                          break;

                        default:
                          break;
                      }
                    }}
                    onInput={handleContentHeight}
                    onBlur={() => {
                      setIsEditing(false);
                      setCheckContent(content);
                    }}
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
      }}
    </Draggable>
  );
};

export default CardCheckItem;
