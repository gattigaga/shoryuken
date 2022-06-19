import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { MdChevronLeft } from "react-icons/md";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import classnames from "classnames";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";

import styles from "../../styles/pages/board-detail.module.css";
import Layout from "../../components/Layout";
import supabase from "../../helpers/supabase";
import BoardTitle from "../../components/BoardTitle";
import { useRouter } from "next/router";
import CreateListForm from "../../components/CreateListForm";
import List from "../../components/List";
import { withAuthGuard } from "../../helpers/server";
import useBoardQuery from "../../hooks/boards/use-board-query";
import useDeleteBoardMutation from "../../hooks/boards/use-delete-board-mutation";
import useListsQuery from "../../hooks/lists/use-lists-query";
import useUpdateListMutation from "../../hooks/lists/use-update-list-mutation";
import useUpdateCardMutation from "../../hooks/cards/use-update-card-mutation";
import ModalCardDetail from "../../components/ModalCardDetail";

export const getServerSideProps: GetServerSideProps = withAuthGuard(
  async ({ params }) => {
    const { slug } = params as {
      slug: string;
    };

    const { data: boards, error: boardsError } = await supabase
      .from("boards")
      .select("*")
      .eq("slug", slug);

    if (boardsError) {
      throw boardsError;
    }

    if (!boards.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialBoard: boards[0],
      },
    };
  }
);

type Props = NextPage & {
  initialBoard: {
    id: number;
    title: string;
    slug: string;
  };
};

const BoardDetailPage: React.FC<Props> = ({ initialBoard }) => {
  const router = useRouter();

  const boardQuery = useBoardQuery(initialBoard.id, initialBoard);
  const listsQuery = useListsQuery(initialBoard.id);
  const deleteBoardMutation = useDeleteBoardMutation();
  const updateListMutation = useUpdateListMutation();
  const updateCardMutation = useUpdateCardMutation();

  const deleteBoard = async () => {
    try {
      await deleteBoardMutation.mutateAsync({
        id: boardQuery.data!.id,
      });

      await router.replace("/dashboard");
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
    try {
      await updateListMutation.mutateAsync({
        id: listId,
        boardId: boardQuery.data!.id,
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
    <Layout>
      <Head>
        <title>{boardQuery.data!.title} | Shoryuken</title>
      </Head>

      <div className="bg-blue-600 h-screen flex flex-col">
        {deleteBoardMutation.status === "idle" && (
          <>
            <div className="flex items-center my-4 px-4">
              <Link href="/dashboard">
                <a className="mr-4">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <MdChevronLeft color="white" size={24} />
                  </div>
                </a>
              </Link>
              <BoardTitle id={boardQuery.data!.id} />
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
                            {listsQuery.data.map((list: any, index: number) => (
                              <List
                                key={list.id}
                                id={list.id}
                                boardId={boardQuery.data!.id}
                                index={index}
                                title={list.title}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <CreateListForm boardId={boardQuery.data!.id} />
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
        {deleteBoardMutation.status === "loading" && (
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
      <ModalCardDetail />
    </Layout>
  );
};

export default BoardDetailPage;
