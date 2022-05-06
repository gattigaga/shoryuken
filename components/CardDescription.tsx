import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdViewHeadline, MdClose } from "react-icons/md";

import useCardQuery from "../hooks/cards/use-card-query";
import useUpdateCardMutation from "../hooks/cards/use-update-card-mutation";
import Button from "./Button";

type Props = {
  id: number;
};

const CardDescription: React.FC<Props> = ({ id }) => {
  const { data: card } = useCardQuery(id);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const refInput = useRef<HTMLTextAreaElement>(null);
  const updateCardMutation = useUpdateCardMutation();

  const applyDescription = async () => {
    setIsEditing(false);

    try {
      await updateCardMutation.mutateAsync({
        id,
        listId: card.list_id,
        body: {
          description,
        },
      });
    } catch (error) {
      toast.error("Failed to update a card description.");
    }
  };

  const handleInputHeight = () => {
    if (!refInput.current) return;

    refInput.current.style.height = "128px";
    refInput.current.style.height = refInput.current.scrollHeight + "px";
  };

  useEffect(() => {
    if (card) {
      setDescription(card.description);
    }
  }, [card]);

  return (
    <div className="flex flex-1">
      <span className="text-slate-700 mr-3 mt-[0.1rem]">
        <MdViewHeadline size={24} />
      </span>
      <div className="w-full">
        <h2 className="text-lg text-slate-700 font-semibold mb-4">
          Description
        </h2>
        {!isEditing && (
          <>
            {card?.description ? (
              <button
                className="w-full text-left flex text-slate-700 text-xs rounded py-1"
                type="button"
                onClick={() => {
                  setIsEditing(true);

                  setTimeout(() => {
                    refInput.current?.select();
                  }, 100);
                }}
              >
                <p className="whitespace-pre-line break-all">
                  {card.description}
                </p>
              </button>
            ) : (
              <button
                className="w-full text-left flex text-slate-700 text-xs h-16 bg-slate-300 rounded p-3 hover:bg-slate-400"
                type="button"
                onClick={() => {
                  setIsEditing(true);

                  setTimeout(() => {
                    refInput.current?.select();
                  }, 100);
                }}
              >
                <p>Add a more detailed description...</p>
              </button>
            )}
          </>
        )}
        {isEditing && (
          <div>
            <textarea
              ref={refInput}
              className="w-full h-24 p-3 rounded text-xs resize-none"
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  setIsEditing(false);
                  setDescription(card?.description);
                }
              }}
              onInput={handleInputHeight}
            />
            <div className="flex items-center">
              <Button
                className="outline-black mr-2"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  applyDescription();
                }}
              >
                Save
              </Button>
              <button
                className="text-slate-500 hover:text-slate-600"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDescription(card?.description);
                }}
              >
                <MdClose size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDescription;
