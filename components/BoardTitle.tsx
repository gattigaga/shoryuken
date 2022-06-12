import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import useBoardQuery from "../hooks/boards/use-board-query";
import useUpdateBoardMutation from "../hooks/boards/use-update-board-mutation";

type Props = {
  id: number;
};

const BoardTitle: React.FC<Props> = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const refText = useRef<HTMLHeadingElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const boardsQuery = useBoardQuery(id);
  const updateBoardMutation = useUpdateBoardMutation();

  const updateTitle = async (title: string) => {
    if (!title) return;

    try {
      await updateBoardMutation.mutateAsync({
        id,
        body: {
          title,
        },
      });
    } catch (error) {
      toast.error("Failed to update board title.");
    }
  };

  const handleInputWidth = (content: string) => {
    if (!refInput.current) return;

    refInput.current.style.width = `${content.length * 0.9}ch`;
  };

  useEffect(() => {
    if (isEditing) {
      handleInputWidth(boardsQuery.data?.title || "");
    }
  }, [isEditing, boardsQuery.data?.title]);

  return (
    <div>
      {/* Static mode */}
      {!isEditing && (
        <h1
          ref={refText}
          className="px-1 text-white text-lg font-semibold inline-block cursor-pointer"
          tabIndex={0}
          onClick={() => {
            setIsEditing(true);

            setTimeout(() => {
              refInput.current?.select();
            }, 0);
          }}
        >
          {boardsQuery.data?.title}
        </h1>
      )}

      {/* Edit mode */}
      {isEditing && (
        <input
          ref={refInput}
          className="py-0 px-1 rounded text-lg font-semibold"
          type="text"
          defaultValue={boardsQuery.data?.title}
          onInput={(event) =>
            handleInputWidth((event.target as HTMLInputElement).value)
          }
          onKeyDown={(event) => {
            if (["Enter", "Escape"].includes(event.key)) {
              refInput.current?.blur();
            }
          }}
          onBlur={(event) => {
            setIsEditing(false);
            updateTitle(event.target.value);
          }}
        />
      )}
    </div>
  );
};

export default BoardTitle;
