"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import classnames from "classnames";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";

import styles from "../../../../../styles/pages/board-detail.module.css";
import BoardTitle from "./BoardTitle";
import CreateListForm from "./CreateListForm";
import List from "./List";
import useBoardQuery from "../hooks/use-board-query";
import useDeleteBoardMutation from "../hooks/use-delete-board-mutation";
import useListsQuery from "../../../../../hooks/lists/use-lists-query";
import useUpdateListMutation from "../../../../../hooks/lists/use-update-list-mutation";
import useUpdateCardMutation from "../../../../../hooks/cards/use-update-card-mutation";
import ModalCardDetail from "./ModalCardDetail";

type Props = {};

const Content: FC<Props> = ({}) => {
  const router = useRouter();
  const params = useParams();

  const boardId = Number(((params?.slug as string) || "").split("-")[0]);

  const boardQuery = useBoardQuery(boardId);
  const listsQuery = useListsQuery(boardId);
  const deleteBoardMutation = useDeleteBoardMutation();
  const updateListMutation = useUpdateListMutation();
  const updateCardMutation = useUpdateCardMutation();

  const deleteBoard = async () => {
    if (!boardQuery.data) return;

    try {
      await deleteBoardMutation.mutateAsync({
        id: boardQuery.data.id,
      });

      router.replace("/dashboard");
    } catch (error) {
      toast.error("Failed to delete a board.");
    }
  };

  const moveList = async ({
    listId,
    toIndex,
  }: {
    listId: number;
    toIndex: number;
  }) => {
    if (!boardQuery.data) return;

    try {
      await updateListMutation.mutateAsync({
        id: listId,
        boardId: boardQuery.data.id,
        body: {
          index: toIndex,
        },
      });
    } catch (error) {
      toast.error("Failed to move a list.");
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
      toast.error("Failed to move a card.");
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
    <>
      <div className="bg-blue-600 h-screen flex flex-col">
        {deleteBoardMutation.status === "idle" &&
          boardQuery.status === "success" && (
            <>
              <div className="flex items-center my-4 px-4">
                <Link href="/dashboard" className="mr-4">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <MdChevronLeft color="white" size={24} />
                  </div>
                </Link>
                <BoardTitle id={boardQuery.data.id} />
                <button
                  className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
                  type="button"
                  onClick={deleteBoard}
                >
                  Delete
                </button>
              </div>
              <div className="flex-1 flex pb-4 px-4">
                {listsQuery.status === "success" && (
                  <div
                    className={classnames(
                      "overflow-x-auto flex-1",
                      styles.content
                    )}
                  >
                    <div className="flex items-start">
                      <DragDropContext onDragEnd={handleMovement}>
                        <Droppable
                          droppableId="lists"
                          direction="horizontal"
                          type="LIST"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              className="flex items-start"
                              {...provided.droppableProps}
                            >
                              {listsQuery.data.map(
                                (list: any, index: number) => (
                                  <List
                                    key={list.id}
                                    id={list.id}
                                    boardId={boardQuery.data.id}
                                    index={index}
                                    title={list.title}
                                  />
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <CreateListForm boardId={boardQuery.data.id} />
                      </DragDropContext>
                    </div>
                  </div>
                )}
                {listsQuery.status === "loading" && (
                  <div className="h-full w-full flex justify-center items-center">
                    <Loading
                      height={72}
                      width={8}
                      radius={16}
                      margin={4}
                      color="rgb(29 78 216)"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        {(deleteBoardMutation.status === "loading" ||
          boardQuery.status === "loading") && (
          <div className="h-full w-full flex justify-center items-center">
            <Loading
              height={72}
              width={8}
              radius={16}
              margin={4}
              color="rgb(29 78 216)"
            />
          </div>
        )}
        {boardQuery.status === "error" && (
          <div className="h-full w-full flex flex-col items-center pt-32">
            <p className="font-semibold text-white text-3xl mb-6">
              Board not found
            </p>
            <p className="text-white text-sm text-center px-4 max-w-lg mb-8">
              This board may be private. If someone gave you this link, they may
              need to invite you to one of their boards or Workspaces.
            </p>
            <button
              className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
              type="button"
              onClick={() => router.replace("/dashboard")}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
      <ModalCardDetail />
    </>
  );
};

export default Content;
