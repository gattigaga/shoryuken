import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import classnames from "classnames";

import Button from "./Button";
import Card from "./Card";
import useDeleteListMutation from "../hooks/lists/use-delete-list-mutation";
import useUpdateListBoardMutation from "../hooks/lists/use-update-list-mutation";
import useCardsQuery from "../hooks/cards/use-cards-query";
import useCreateCardMutation from "../hooks/cards/use-create-card-mutation";

type Props = {
  id: number;
  boardId: number;
  index: number;
  title: string;
};

const List: React.FC<Props> = ({ id, boardId, index, title }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isCreateCardFormOpen, setIsCreateCardFormOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const refListTitleInput = useRef<HTMLInputElement>(null);
  const refCardTitleInput = useRef<HTMLTextAreaElement>(null);
  const deleteListMutation = useDeleteListMutation();
  const updateListMutation = useUpdateListBoardMutation();
  const createCardMutation = useCreateCardMutation();

  const { data: cards } = useCardsQuery(id);

  const maxHeight = (() => {
    const viewportHeight = window?.innerHeight || 0;
    const footerHeight = isCreateCardFormOpen ? 40 : 0;

    return viewportHeight * 0.6 + footerHeight;
  })();

  const deleteList = async () => {
    try {
      await deleteListMutation.mutateAsync({
        id,
        boardId,
      });
    } catch (error) {
      toast.error("Failed to delete a list.");
    }
  };

  const updateListTitle = async (title: string) => {
    if (!title) return;

    setIsEditingTitle(false);

    try {
      await updateListMutation.mutateAsync({
        id,
        boardId,
        body: {
          title,
        },
      });
    } catch (error) {
      toast.error("Failed to update a list.");
    }
  };

  const createCard = async () => {
    try {
      await createCardMutation.mutateAsync({
        title: cardTitle,
        list_id: id,
      });
    } catch (error) {
      toast.error("Failed to delete a card.");
    }
  };

  const handleCardTitleHeight = () => {
    if (!refCardTitleInput.current) return;

    refCardTitleInput.current.style.height = "64px";

    refCardTitleInput.current.style.height =
      refCardTitleInput.current.scrollHeight + "px";
  };

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
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={classnames(
            "shrink-0 w-72 bg-slate-300 rounded mr-2 flex flex-col",
            {
              "shadow-xl": snapshot.isDragging,
            }
          )}
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
                  updateListTitle(event.target.value);
                }}
              />
            )}
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-slate-600 hover:bg-slate-400"
              type="button"
              onClick={deleteList}
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Children */}
          <div style={{ maxHeight }} className="overflow-auto px-2">
            {/* Card list */}
            <Droppable droppableId={`list-${id}`} type="CARD">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {cards?.map((card, index) => {
                    return (
                      <Card
                        key={card.id}
                        id={card.id}
                        boardId={boardId}
                        index={index}
                        title={card.title}
                        slug={card.slug}
                        hasDescription={!!card.description}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Create card form */}
            {isCreateCardFormOpen && (
              <div className="pb-2">
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
                          createCard();
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
                    onInput={handleCardTitleHeight}
                  />
                </div>
                <div className="flex items-center">
                  <Button
                    className="outline-black mr-2"
                    type="button"
                    onClick={() => {
                      createCard();
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
            <div className="px-2 h-10 flex items-start">
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
