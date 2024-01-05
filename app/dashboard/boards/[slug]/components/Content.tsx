"use client";

import { FC, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import classnames from "classnames";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import styles from "../styles/Content.module.css";
import BoardTitle from "./BoardTitle";
import CreateListForm from "./CreateListForm";
import List from "./List";
import useBoardQuery from "../hooks/use-board-query";
import useDeleteBoardMutation from "../hooks/use-delete-board-mutation";
import useListsQuery from "../hooks/use-lists-query";
import useUpdateListMutation from "../hooks/use-update-list-mutation";
import useUpdateCardMutation from "../hooks/use-update-card-mutation";
import ModalCardDetail from "./ModalCardDetail";
import NotFound from "./NotFound";
import { Board as TBoard, List as TList } from "../../../../types/models";

type Props = {
  board?: TBoard;
  lists?: TList[];
};

const Content: FC<Props> = ({ board, lists }) => {
  const router = useRouter();
  const { _ } = useLingui();
  const refScrollWrapper = useRef<HTMLDivElement>(null);

  const boardId = board?.id || 0;

  const boardQuery = useBoardQuery(boardId, board);
  const listsQuery = useListsQuery(boardId, lists);
  const deleteBoardMutation = useDeleteBoardMutation();
  const updateListMutation = useUpdateListMutation();
  const updateCardMutation = useUpdateCardMutation();

  const isLoading = boardQuery.isLoading || deleteBoardMutation.isLoading;
  const isContentShow = boardQuery.isSuccess && deleteBoardMutation.isIdle;

  const deleteBoard = async () => {
    if (!boardQuery.data) return;

    try {
      await deleteBoardMutation.mutateAsync({
        id: boardQuery.data.id,
      });

      router.replace("/dashboard");
    } catch (error) {
      toast.error(_(msg`Failed to delete a board.`));
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
    <>
      <div className="bg-blue-600 h-screen flex flex-col">
        {isContentShow && (
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
                <Trans>Delete</Trans>
              </button>
            </div>
            <div className="flex-1 flex pb-4 px-4">
              {listsQuery.isSuccess && (
                <div
                  ref={refScrollWrapper}
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
                            {listsQuery.data.map((list: any, index: number) => (
                              <List
                                key={list.id}
                                id={list.id}
                                boardId={boardQuery.data.id}
                                index={index}
                                title={list.title}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <CreateListForm
                        boardId={boardQuery.data.id}
                        onClickAdd={() => {
                          refScrollWrapper.current?.scrollTo({
                            left: refScrollWrapper.current.scrollWidth,
                            behavior: "smooth",
                          });
                        }}
                      />
                    </DragDropContext>
                  </div>
                </div>
              )}
              {listsQuery.isLoading && (
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

        {isLoading && (
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

        {boardQuery.isError && <NotFound />}
      </div>
      <ModalCardDetail />
    </>
  );
};

export default Content;
