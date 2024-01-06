"use client";

import { FC, useRef } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import useUpdateCardMutation from "../hooks/use-update-card-mutation";
import useUpdateListMutation from "../hooks/use-update-list-mutation";
import CreateListForm from "./CreateListForm";
import List from "./List";
import { Board as TBoard, List as TList } from "../../../../types/models";
import { getTailwindColors } from "../../../helpers/others";

type Props = {
  board: TBoard;
  lists: TList[];
};

const DragDropArea: FC<Props> = ({ board, lists }) => {
  const refScrollWrapper = useRef<HTMLDivElement>(null);
  const { _ } = useLingui();
  const updateListMutation = useUpdateListMutation();
  const updateCardMutation = useUpdateCardMutation();

  const moveList = async ({
    listId,
    toIndex,
  }: {
    listId: number;
    toIndex: number;
  }) => {
    if (!board) return;

    try {
      await updateListMutation.mutateAsync({
        id: listId,
        boardId: board.id,
        body: {
          index: toIndex,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to move a list.`));
    }
  };

  const moveCard = async ({
    cardId,
    fromListId,
    toListId,
    toIndex,
  }: {
    cardId: number;
    fromListId: number;
    toListId?: number;
    toIndex: number;
  }) => {
    try {
      await updateCardMutation.mutateAsync({
        id: cardId,
        listId: fromListId,
        body: {
          index: toIndex,
          list_id: toListId,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to move a card.`));
    }
  };

  const handleMovement = (result: DropResult) => {
    const fromIndex = result.source.index;
    const toIndex = result.destination?.index;

    if (toIndex === undefined) return;

    if (result.type === "LIST") {
      const isUpdated = toIndex !== fromIndex;

      if (!isUpdated) return;

      const id = result.draggableId.replace("list-", "");

      moveList({
        listId: Number(id),
        toIndex,
      });

      return;
    }

    if (result.type === "CARD") {
      const id = result.draggableId.replace("card-", "");
      const fromListId = result.source.droppableId.replace("list-", "");
      const toListId = result.destination?.droppableId.replace("list-", "");

      const validToList =
        toListId !== fromListId && !!toListId ? Number(toListId) : undefined;

      moveCard({
        cardId: Number(id),
        fromListId: Number(fromListId),
        toListId: validToList,
        toIndex,
      });

      return;
    }
  };

  return (
    <div ref={refScrollWrapper} className="scroll overflow-x-auto flex-1">
      <div className="flex items-start">
        <DragDropContext onDragEnd={handleMovement}>
          <Droppable droppableId="lists" direction="horizontal" type="LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="flex items-start"
                {...provided.droppableProps}
              >
                {lists.map((list, index: number) => (
                  <List
                    key={list.id}
                    id={list.id}
                    boardId={board.id}
                    index={index}
                    title={list.title}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <CreateListForm
            board={board}
            onClickAdd={() => {
              refScrollWrapper.current?.scrollTo({
                left: refScrollWrapper.current.scrollWidth,
                behavior: "smooth",
              });
            }}
          />
        </DragDropContext>
      </div>

      <style jsx>{`
        .scroll::-webkit-scrollbar {
          height: 0.75rem;
        }

        .scroll::-webkit-scrollbar-track {
          background: ${getTailwindColors(board.color, 700)};
          border-radius: 1rem;
        }

        .scroll::-webkit-scrollbar-thumb {
          background: ${getTailwindColors(board.color, 400)};
          border-radius: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DragDropArea;
