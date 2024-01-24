"use client";

import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import classnames from "classnames";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import styled from "styled-components";

import Button from "../../../../components/Button";
import Card from "./Card";
import useDeleteListMutation from "../hooks/use-delete-list-mutation";
import useUpdateListBoardMutation from "../hooks/use-update-list-mutation";
import useCardsQuery from "../hooks/use-cards-query";
import useCreateCardMutation from "../hooks/use-create-card-mutation";
import useBoardQuery from "../hooks/use-board-query";
import { getTailwindColors } from "../../../helpers/others";
import PopupDeleteConfirmation from "./PopupDeleteConfirmation";

const StyledScroll = styled.div`
  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: ${getTailwindColors("slate", 300)};
  }

  &::-webkit-scrollbar-thumb {
    background: ${getTailwindColors("slate", 400)};
  }
`;

type Props = {
  id: number;
  boardId: number;
  index: number;
  title: string;
};

const List: React.FC<Props> = ({ id, boardId, index, title }) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isCreateCardFormOpen, setIsCreateCardFormOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [maxHeight, setMaxHeight] = useState(0);
  const refListTitleInput = useRef<HTMLInputElement>(null);
  const refCardTitleInput = useRef<HTMLTextAreaElement>(null);
  const refCreateCardForm = useRef<HTMLDivElement>(null);
  const refChildren = useRef<HTMLDivElement>(null);
  const { _ } = useLingui();
  const boardQuery = useBoardQuery(boardId);
  const cardsQuery = useCardsQuery(id);
  const deleteListMutation = useDeleteListMutation();
  const updateListMutation = useUpdateListBoardMutation();
  const createCardMutation = useCreateCardMutation();

  const deleteList = async () => {
    try {
      await deleteListMutation.mutateAsync({
        id,
        boardId,
      });

      toast.success(_(msg`List successfully deleted.`));
    } catch (error) {
      toast.error(_(msg`Failed to delete a list.`));
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
      toast.error(_(msg`Failed to update a list.`));
    }
  };

  const createCard = async () => {
    try {
      await createCardMutation.mutateAsync({
        body: {
          title: cardTitle,
          list_id: id,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to delete a card.`));
    }
  };

  const handleCardTitleHeight = () => {
    if (!refCardTitleInput.current) return;

    refCardTitleInput.current.style.height = "64px";

    refCardTitleInput.current.style.height =
      refCardTitleInput.current.scrollHeight + "px";
  };

  const scrollToBottom = () => {
    refChildren.current?.scrollTo(0, refChildren.current.scrollHeight);
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
      scrollToBottom();
      refCardTitleInput.current?.focus();
    }
  }, [isCreateCardFormOpen]);

  // Close form if outside is clicked.
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refCreateCardForm.current) {
        if (!refCreateCardForm.current.contains(event.target)) {
          setIsCreateCardFormOpen(false);
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  // Handle max height.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewportHeight = window.innerHeight || 0;
      const footerHeight = isCreateCardFormOpen ? 40 : 0;
      const result = viewportHeight * 0.6 + footerHeight;

      setMaxHeight(result);
    }
  }, [isCreateCardFormOpen]);

  return (
    <>
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
                <div className="flex-1">
                  <input
                    ref={refListTitleInput}
                    className="w-full px-2 py-1 text-sm text-slate-700 font-semibold rounded"
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
                </div>
              )}
              <button
                className="ml-2 w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:text-slate-600 hover:bg-slate-400"
                type="button"
                onClick={() => setIsDeleteConfirmationOpen(true)}
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Children */}
            <StyledScroll
              ref={refChildren}
              style={{ maxHeight }}
              className="overflow-y-auto px-2"
            >
              {/* Card list */}
              <Droppable droppableId={`list-${id}`} type="CARD">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {cardsQuery.status === "success" && (
                      <>
                        {cardsQuery.data.map((card, index) => {
                          const totalChecks = card.checks?.length || 0;

                          const totalCompletedChecks =
                            card.checks?.filter(
                              (check: any) => check.is_checked
                            ).length || 0;

                          const href = `/dashboard/boards/${boardQuery.data?.slug}?card=${card.id}-${card.slug}`;

                          return (
                            <Card
                              key={card.id}
                              id={card.id}
                              href={href}
                              index={index}
                              title={card.title}
                              dueDate={card.due_dates?.[0]?.timestamp}
                              totalChecks={totalChecks}
                              totalCompletedChecks={totalCompletedChecks}
                              hasDescription={!!card.description}
                              hasChecklist={card.has_checklist}
                              isDueDateDone={!!card.due_dates?.[0]?.is_done}
                              isDisabled={card.id > 10000}
                            />
                          );
                        })}
                      </>
                    )}
                    {/* List with empty cards need to have a spacer
                  so user can move cards from other list to this list. */}
                    {!cardsQuery.data?.length && <div className="h-[1px]" />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Create card form */}
              {isCreateCardFormOpen && (
                <div ref={refCreateCardForm} className="pb-2">
                  <div className="bg-white rounded shadow mb-2">
                    <textarea
                      ref={refCardTitleInput}
                      className="w-full p-2 border-0 resize-none rounded text-xs h-16 focus:ring-0"
                      value={cardTitle}
                      placeholder={_(msg`Enter a title for this card...`)}
                      onChange={(event) => setCardTitle(event.target.value)}
                      onKeyDown={(event) => {
                        switch (event.key) {
                          case "Enter":
                            event.preventDefault();
                            createCard();
                            setCardTitle("");
                            scrollToBottom();
                            refCardTitleInput.current?.focus();
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
                        setCardTitle("");
                        scrollToBottom();
                        refCardTitleInput.current?.focus();
                      }}
                    >
                      <Trans>Add card</Trans>
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
            </StyledScroll>

            {/* Footer */}
            {!isCreateCardFormOpen && (
              <div className="px-2 h-10 flex items-start">
                <button
                  className="w-full px-2 py-1 rounded flex items-center text-slate-500 hover:text-slate-600 hover:bg-slate-400"
                  type="button"
                  onClick={() => setIsCreateCardFormOpen(true)}
                >
                  <MdAdd size={24} />
                  <p className="ml-2 text-xs">
                    <Trans>Add a card</Trans>
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </Draggable>

      <PopupDeleteConfirmation
        description={_(
          msg`This action cannot be undone. This will permanently delete this list.`
        )}
        isOpen={isDeleteConfirmationOpen}
        onRequestClose={() => setIsDeleteConfirmationOpen(false)}
        onClickConfirm={deleteList}
      />
    </>
  );
};

export default List;
