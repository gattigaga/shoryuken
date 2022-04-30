import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";

import Button from "./Button";

type Props = {
  id: string | number;
  index: number;
  title: string;
  children?: JSX.Element | JSX.Element[];
  onSubmitTitle?: (value: string) => void;
  onClickRemove?: () => void;
  onClickAddCard?: (value: string) => void;
};

const List: React.FC<Props> = ({
  id,
  index,
  title,
  children,
  onSubmitTitle,
  onClickRemove,
  onClickAddCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isCreateCardFormOpen, setIsCreateCardFormOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const refListTitleInput = useRef<HTMLInputElement>(null);
  const refCardTitleInput = useRef<HTMLTextAreaElement>(null);

  const maxHeight = (() => {
    const viewportHeight = window?.innerHeight || 0;
    const footerHeight = isCreateCardFormOpen ? 48 : 0;

    return viewportHeight * 0.6 + footerHeight;
  })();

  // Set focus on list title input if title editing form opened.
  useEffect(() => {
    if (isEditingTitle) {
      refListTitleInput.current?.select();
    }
  }, [isEditingTitle]);

  // Set focus on card title input if create card form opened.
  useEffect(() => {
    if (isCreateCardFormOpen) {
      refCardTitleInput.current?.focus();
    }
  }, [isCreateCardFormOpen]);

  return (
    <Draggable draggableId={`list-${id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="shrink-0 w-72 bg-slate-300 rounded mr-2 flex flex-col"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Header */}
          <div className="w-full flex items-center px-2 h-12">
            {!isEditingTitle ? (
              <button
                className="flex-1 text-left px-2 py-1 text-sm text-slate-700 font-semibold"
                type="button"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </button>
            ) : (
              <input
                ref={refListTitleInput}
                className="w-64 flex-1 px-2 py-1 text-sm text-slate-700 font-semibold rounded"
                type="text"
                defaultValue={title}
                onKeyDown={(event) => {
                  if (["Enter", "Escape"].includes(event.key)) {
                    refListTitleInput.current?.blur();
                  }
                }}
                onBlur={(event) => {
                  setIsEditingTitle(false);
                  onSubmitTitle?.(event.target.value);
                }}
              />
            )}
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-slate-600 hover:bg-slate-400"
              type="button"
              onClick={onClickRemove}
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Children */}
          <div style={{ maxHeight }} className="overflow-auto px-2">
            {children}
            {isCreateCardFormOpen && (
              <div className="py-2">
                <div className="bg-white rounded shadow mb-2">
                  <textarea
                    ref={refCardTitleInput}
                    className="w-full p-2 border-0 resize-none rounded text-xs h-16 focus:ring-0"
                    value={cardTitle}
                    placeholder="Enter a title for this card..."
                    onChange={(event) => setCardTitle(event.target.value)}
                    onKeyDown={(event) => {
                      switch (event.key) {
                        case "Enter":
                          event.preventDefault();
                          onClickAddCard?.(cardTitle);
                          setIsCreateCardFormOpen(false);
                          setCardTitle("");
                          break;

                        case "Escape":
                          setIsCreateCardFormOpen(false);
                          setCardTitle("");
                          break;

                        default:
                          break;
                      }
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <Button
                    className="outline-black mr-2"
                    type="button"
                    onClick={() => {
                      onClickAddCard?.(cardTitle);
                      setIsCreateCardFormOpen(false);
                      setCardTitle("");
                    }}
                  >
                    Add card
                  </Button>
                  <button
                    className="text-slate-500 hover:text-slate-600"
                    type="button"
                    onClick={() => {
                      setIsCreateCardFormOpen(false);
                      setCardTitle("");
                    }}
                  >
                    <MdClose size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isCreateCardFormOpen && (
            <div className="px-2 h-12 flex items-center">
              <button
                className="w-full px-2 py-1 rounded flex items-center text-slate-500 hover:text-slate-600 hover:bg-slate-400"
                type="button"
                onClick={() => setIsCreateCardFormOpen(true)}
              >
                <MdAdd size={24} />
                <p className="ml-2 text-xs">Add a card</p>
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default List;
