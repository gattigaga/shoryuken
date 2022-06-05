import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineCheckBox } from "react-icons/md";
import { motion } from "framer-motion";

import useChecksQuery from "../hooks/checks/use-checks-query";
import useCreateCheckMutation from "../hooks/checks/use-create-check-mutation";
import Button from "./Button";
import CardCheckItem from "./CardCheckItem";
import useUpdateCardMutation from "../hooks/cards/use-update-card-mutation";
import useCardQuery from "../hooks/cards/use-card-query";

type Props = {
  id: number;
};

const CardChecklist: React.FC<Props> = ({ id }) => {
  const { data: card } = useCardQuery(id);
  const { data: checks } = useChecksQuery(id);
  const [isCreateCheckFormOpen, setIsCreateCheckFormOpen] = useState(false);
  const [checkContent, setCheckContent] = useState("");
  const refContentInput = useRef<HTMLTextAreaElement>(null);
  const createCheckMutation = useCreateCheckMutation();
  const updateCardMutation = useUpdateCardMutation();

  const totalCheckItems = checks?.length || 0;

  const totalCheckItemsCompleted = checks?.reduce((acc, check) => {
    return acc + Number(check.is_checked);
  }, 0);

  // in range 0 - 100.
  const percentage = (() => {
    const value = (totalCheckItemsCompleted / totalCheckItems) * 100;

    return Number.isNaN(value) || !Number.isFinite(value) ? 0 : value;
  })();

  const progressColor =
    percentage === 100 ? "rgb(34 197 94)" : "rgb(37 99 235)";

  const handleContentHeight = () => {
    if (!refContentInput.current) return;

    refContentInput.current.style.height = "64px";

    refContentInput.current.style.height =
      refContentInput.current.scrollHeight + "px";
  };

  const deleteChecklist = async () => {
    try {
      await updateCardMutation.mutateAsync({
        id,
        listId: card.list_id,
        body: {
          has_checklist: false,
        },
      });
    } catch (error) {
      toast.error("Failed to delete checklist.");
    }
  };

  const addCheckItem = async (content: string) => {
    if (!content) return;

    try {
      await createCheckMutation.mutateAsync({
        content,
        card_id: id,
      });
    } catch (error) {
      toast.error("Failed to add check item.");
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
            Checklist
          </h2>
          <Button
            className="outline-black mt-[-1rem]"
            backgroundColor={["bg-slate-200", "bg-slate-300"]}
            textColor="text-slate-700"
            type="button"
            onClick={deleteChecklist}
          >
            Delete
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center mb-2">
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
        <div className="mb-2">
          {checks?.map((check) => (
            <CardCheckItem
              key={check.id}
              id={check.id}
              listId={card.list_id}
              cardId={check.card_id}
              content={check.content}
              isChecked={check.is_checked}
            />
          ))}
        </div>

        {/* Add new check item form */}
        {isCreateCheckFormOpen ? (
          <div className="flex px-2 rounded cursor-pointer">
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
                      setIsCreateCheckFormOpen(false);
                      addCheckItem(checkContent);
                      setCheckContent("");
                      break;

                    case "Escape":
                      setIsCreateCheckFormOpen(false);
                      setCheckContent("");
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
                    setIsCreateCheckFormOpen(false);
                    addCheckItem(checkContent);
                    setCheckContent("");
                  }}
                >
                  Add
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
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className="w-8" />
            <Button
              className="outline-black mr-2"
              backgroundColor={["bg-slate-200", "bg-slate-300"]}
              textColor="text-slate-700"
              type="button"
              onClick={() => setIsCreateCheckFormOpen(true)}
            >
              Add an item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardChecklist;
