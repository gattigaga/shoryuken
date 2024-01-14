"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineCheckBox } from "react-icons/md";
import { motion } from "framer-motion";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import useChecksQuery from "../hooks/use-checks-query";
import useCreateCheckMutation from "../hooks/use-create-check-mutation";
import useUpdateCardMutation from "../hooks/use-update-card-mutation";
import useCardQuery from "../hooks/use-card-query";
import useUpdateCheckMutation from "../hooks/use-update-check-mutation";
import CardCheckItem from "./CardCheckItem";
import Button from "../../../../components/Button";

type Props = {
  id: number;
};

const CardChecklist: React.FC<Props> = ({ id }) => {
  const cardQuery = useCardQuery(id);
  const checksQuery = useChecksQuery(id);
  const [isCreateCheckFormOpen, setIsCreateCheckFormOpen] = useState(false);
  const [checkContent, setCheckContent] = useState("");
  const refContentInput = useRef<HTMLTextAreaElement>(null);
  const { _ } = useLingui();
  const createCheckMutation = useCreateCheckMutation();
  const updateCheckMutation = useUpdateCheckMutation();
  const updateCardMutation = useUpdateCardMutation();

  const totalCheckItems = checksQuery.data?.length || 0;

  const totalCheckItemsCompleted =
    checksQuery.data?.reduce((acc, check) => {
      return acc + Number(check.is_checked);
    }, 0) || 0;

  // in range 0 - 100.
  const percentage = (() => {
    const value = (totalCheckItemsCompleted / totalCheckItems) * 100;
    const result = Number.isNaN(value) || !Number.isFinite(value) ? 0 : value;

    return Number(result.toFixed(0));
  })();

  const progressColor = percentage >= 100 ? "rgb(34 197 94)" : "rgb(37 99 235)";

  const handleContentHeight = () => {
    if (!refContentInput.current) return;

    refContentInput.current.style.height = "64px";

    refContentInput.current.style.height =
      refContentInput.current.scrollHeight + "px";
  };

  const deleteChecklist = async () => {
    if (!cardQuery.data) return;

    try {
      await updateCardMutation.mutateAsync({
        id,
        listId: cardQuery.data.list_id,
        body: {
          has_checklist: false,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to delete checklist.`));
    }
  };

  const addCheckItem = async (content: string) => {
    if (!cardQuery.data || !content) return;

    try {
      await createCheckMutation.mutateAsync({
        listId: cardQuery.data.list_id,
        body: {
          content,
          card_id: id,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to add check item.`));
    }
  };

  const moveCheck = async ({
    checkId,
    toIndex,
  }: {
    checkId: number;
    toIndex: number;
  }) => {
    if (!cardQuery.data) return;

    try {
      await updateCheckMutation.mutateAsync({
        id: checkId,
        listId: cardQuery.data.list_id,
        cardId: cardQuery.data.id,
        body: {
          index: toIndex,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to move a check item.`));
    }
  };

  // Set focus on check content input if in editing mode.
  useEffect(() => {
    if (isCreateCheckFormOpen) {
      refContentInput.current?.focus();
    }
  }, [isCreateCheckFormOpen]);

  return (
    <div className="flex flex-1 mt-8">
      <span className="text-slate-700 mr-3 mt-[0.1rem]">
        <MdOutlineCheckBox size={24} />
      </span>
      <div className="w-full">
        <div className="flex items-center">
          <h2 className="text-lg text-slate-700 font-semibold mb-4 mr-auto">
            <Trans>Checklist</Trans>
          </h2>
          <Button
            className="outline-black mt-[-1rem]"
            backgroundColor={["bg-slate-200", "bg-slate-300"]}
            textColor="text-slate-700"
            type="button"
            onClick={deleteChecklist}
          >
            <Trans>Delete</Trans>
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center mb-2 -ml-8 md:ml-0">
          <div className="w-10">
            <p className="text-xs text-slate-500">{percentage}%</p>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full">
            <motion.div
              className="w-0 h-full bg-blue-600 rounded-full"
              animate={{
                width: `${percentage}%`,
                background: progressColor,
              }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="mb-2 -ml-8 md:ml-0">
          <DragDropContext
            onDragEnd={(result) => {
              const fromIndex = result.source.index;
              const toIndex = result.destination?.index;

              if (toIndex === undefined) return;

              const isUpdated = toIndex !== fromIndex;

              if (!isUpdated) return;

              const id = result.draggableId.replace("check-", "");

              moveCheck({
                checkId: Number(id),
                toIndex,
              });

              return;
            }}
          >
            <Droppable droppableId="cards" type="CHECK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {checksQuery.data?.map((check) => (
                    <CardCheckItem
                      key={check.id}
                      id={check.id}
                      index={check.index}
                      listId={cardQuery.data!.list_id}
                      cardId={check.card_id}
                      content={check.content}
                      isChecked={check.is_checked}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Add new check item form */}
        {isCreateCheckFormOpen ? (
          <div className="flex px-2 rounded cursor-pointer -ml-8 md:ml-0">
            <div className="w-6" />
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
                      addCheckItem(checkContent);
                      setCheckContent("");
                      refContentInput.current?.focus();
                      break;

                    case "Escape":
                      event.stopPropagation();
                      setIsCreateCheckFormOpen(false);
                      setCheckContent("");
                      break;

                    default:
                      break;
                  }
                }}
                onInput={handleContentHeight}
                onBlur={() => {
                  setIsCreateCheckFormOpen(false);
                  setCheckContent("");
                }}
              />
              <div className="flex items-center">
                <Button
                  className="outline-black mr-2"
                  type="button"
                  onClick={() => {
                    addCheckItem(checkContent);
                    setCheckContent("");
                    refContentInput.current?.focus();
                  }}
                >
                  <Trans>Add</Trans>
                </Button>
                <Button
                  className="outline-black mr-2"
                  backgroundColor={["bg-slate-100", "bg-slate-200"]}
                  textColor="text-slate-700"
                  type="button"
                  onClick={() => {
                    setIsCreateCheckFormOpen(false);
                    setCheckContent("");
                  }}
                >
                  <Trans>Cancel</Trans>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex -ml-8 md:ml-0">
            <div className="w-8" />
            <Button
              className="outline-black mr-2"
              backgroundColor={["bg-slate-200", "bg-slate-300"]}
              textColor="text-slate-700"
              type="button"
              onClick={() => setIsCreateCheckFormOpen(true)}
            >
              <Trans>Add an item</Trans>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardChecklist;
