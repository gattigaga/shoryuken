import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdInbox } from "react-icons/md";

import useCardQuery from "../hooks/cards/use-card-query";
import useUpdateCardMutation from "../hooks/cards/use-update-card-mutation";
import useListQuery from "../hooks/lists/use-list-query";

type Props = {
  id: number;
};

const CardTitle: React.FC<Props> = ({ id }) => {
  const { data: card } = useCardQuery(id);
  const { data: list, refetch: refetchList } = useListQuery(card?.list_id);
  const [isEditing, setIsEditing] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const updateCardMutation = useUpdateCardMutation();

  const applyTitle = async (title: string) => {
    setIsEditing(false);

    try {
      await updateCardMutation.mutateAsync({
        id,
        listId: card.list_id,
        body: {
          title,
        },
      });
    } catch (error) {
      toast.error("Failed to update a card title.");
    }
  };

  useEffect(() => {
    if (card) {
      refetchList();
    }
  }, [card]);

  return (
    <div className="flex flex-1 mb-8">
      <span className="text-slate-700 mr-3 mt-1">
        <MdInbox size={24} />
      </span>
      <div className="w-full">
        {!isEditing && (
          <button
            className="w-full text-left"
            type="button"
            onClick={() => {
              setIsEditing(true);

              setTimeout(() => {
                refInput.current?.focus();
              }, 100);
            }}
          >
            <h1 className="text-slate-700 text-2xl font-semibold inline-block">
              {card?.title}
            </h1>
          </button>
        )}
        {isEditing && (
          <input
            ref={refInput}
            className="w-full py-0 px-1 rounded text-2xl font-semibold"
            type="text"
            defaultValue={card?.title}
            onKeyDown={(event) => {
              if (["Enter", "Escape"].includes(event.key)) {
                event.stopPropagation();
                refInput.current?.blur();
              }
            }}
            onBlur={(event) => {
              if (event.target.value) {
                applyTitle(event.target.value);
              }
            }}
          />
        )}
        <p className="text-sm text-slate-500 mt-1">
          in list <span className="underline">{list?.title}</span>
        </p>
      </div>
    </div>
  );
};

export default CardTitle;
