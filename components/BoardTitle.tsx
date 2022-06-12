import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import useBoardQuery from "../hooks/boards/use-board-query";
import useUpdateBoardMutation from "../hooks/boards/use-update-board-mutation";

type Props = {
  id: number;
};

const BoardTitle: React.FC<Props> = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
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

  useEffect(() => {
    if (refText.current) {
      setInputWidth(refText.current.offsetWidth + 24);
    }
  }, [boardsQuery.data?.title]);

  return (
    <div>
      {/* Static mode */}
      {!isEditing && (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);

            setTimeout(() => {
              refInput.current?.focus();
            }, 100);
          }}
        >
          <h1
            ref={refText}
            className="text-white text-lg font-semibold inline-block"
          >
            {boardsQuery.data?.title}
          </h1>
        </button>
      )}

      {/* Edit mode */}
      {isEditing && (
        <input
          ref={refInput}
          className="py-0 px-1 rounded text-lg font-semibold"
          style={{ width: inputWidth }}
          type="text"
          defaultValue={boardsQuery.data?.title}
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
