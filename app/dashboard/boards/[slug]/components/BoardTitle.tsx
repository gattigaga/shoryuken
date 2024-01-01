"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/navigation";

import useBoardQuery from "../hooks/use-board-query";
import useUpdateBoardMutation from "../hooks/use-update-board-mutation";

type Props = {
  id: number;
};

const BoardTitle: React.FC<Props> = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const refText = useRef<HTMLHeadingElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refHiddenText = useRef<HTMLParagraphElement>(null);
  const { _ } = useLingui();
  const router = useRouter();
  const boardsQuery = useBoardQuery(id);
  const updateBoardMutation = useUpdateBoardMutation();

  const submittedText = boardsQuery.data?.title || "";

  const updateTitle = async (title: string) => {
    if (!title) return;

    try {
      const response = await updateBoardMutation.mutateAsync({
        id,
        body: {
          title,
        },
      });

      router.replace(`/dashboard/boards/${response.id}-${response.slug}`);
    } catch (error) {
      toast.error(_(msg`Failed to update board title.`));
    }
  };

  const handleInputWidth = () => {
    if (!refInput.current) return;

    refInput.current.style.width =
      (refHiddenText.current?.clientWidth || 0) + "px";
  };

  // Initialize input text value.
  useEffect(() => {
    if (isEditing) {
      setText(submittedText || "");
    }
  }, [isEditing, submittedText]);

  // Update the input width every time the text changed.
  useEffect(() => {
    if (isEditing) {
      handleInputWidth();
    }
  }, [isEditing, text]);

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
          {submittedText}
        </h1>
      )}

      {/* Edit mode */}
      {isEditing && (
        <div className="relative">
          <input
            ref={refInput}
            className="py-0 px-1 rounded text-lg font-semibold relative"
            type="text"
            defaultValue={submittedText}
            onChange={(event) => {
              setText(event.target.value);
            }}
            onKeyDown={(event) => {
              if (["Enter", "Escape"].includes(event.key)) {
                refInput.current?.blur();
              }
            }}
            onBlur={(event) => {
              setIsEditing(false);
              setText("");
              updateTitle(event.target.value);
            }}
          />
          <p
            ref={refHiddenText}
            className="text-lg font-semibold px-1 w-fit invisible absolute top-0 whitespace-nowrap"
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default BoardTitle;
