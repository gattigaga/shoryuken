import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Layout from "../../components/Layout";
import supabase from "../../helpers/supabase";
import EditableBoardTitle from "../../components/EditableBoardTitle";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import CreateListButton from "../../components/CreateListButton";
import CreateListForm from "../../components/CreateListForm";
import List from "../../components/List";
import { withAuthGuard } from "../../helpers/server";
import useBoardQuery from "../../hooks/boards/use-board-query";
import useUpdateBoardMutation from "../../hooks/boards/use-update-board-mutation";
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
  const [isCreateListFormOpen, setIsCreateListFormOpen] = useState(false);
  const router = useRouter();

  const { data: board } = useBoardQuery(initialBoard.id, initialBoard);
  const { data: lists } = useListsQuery(initialBoard.id);
  const updateBoardMutation = useUpdateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();
  const updateListMutation = useUpdateListMutation();
  const updateCardMutation = useUpdateCardMutation();

  const cardId = (() => {
    const value = (router.query.card as string)?.split("-")[0];

    if (!value) return undefined;

    return Number(value);
  })();

  const updateBoardTitle = async (title: string) => {
    if (!title) return;

    try {
      await updateBoardMutation.mutateAsync({
        id: board.id,
        body: {
          title,
        },
      });
    } catch (error) {
      toast.error("Failed to update board title.");
    }
  };

  const deleteBoard = async () => {
    try {
      await router.replace("/dashboard");
      await deleteBoardMutation.mutateAsync(board.id);
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
        boardId: board.id,
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

  return (
    <Layout>
      <Head>
        <title>{board.title} | Shoryuken</title>
      </Head>

      <div className="bg-blue-600 h-screen flex flex-col">
        <div className="flex items-center my-4 px-4">
          <Link href="/dashboard">
            <a className="mr-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <MdChevronLeft color="white" size={24} />
              </div>
            </a>
          </Link>
          <EditableBoardTitle value={board.title} onSubmit={updateBoardTitle} />
          <button
            className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
            onClick={deleteBoard}
          >
            Delete
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <div className="flex items-start">
            <DragDropContext
              onDragEnd={(result) => {
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

                  const fromListId = result.source.droppableId.replace(
                    "list-",
                    ""
                  );

                  const toListId = result.destination?.droppableId.replace(
                    "list-",
                    ""
                  );

                  const validToList =
                    toListId !== fromListId && !!toListId
                      ? Number(toListId)
                      : undefined;

                  moveCard({
                    cardId: Number(id),
                    fromListId: Number(fromListId),
                    toListId: validToList,
                    toIndex,
                  });

                  return;
                }
              }}
            >
              <div className="shrink-0 w-4 h-4" />
              <Droppable droppableId="lists" direction="horizontal" type="LIST">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    className="flex items-start"
                    {...provided.droppableProps}
                  >
                    {lists.map((list: any, index: number) => (
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
              {isCreateListFormOpen ? (
                <CreateListForm
                  boardId={board.id}
                  onRequestClose={() => setIsCreateListFormOpen(false)}
                />
              ) : (
                <CreateListButton
                  onClick={() => setIsCreateListFormOpen(true)}
                />
              )}
              <div className="shrink-0 w-4 h-4" />
            </DragDropContext>
          </div>
        </div>
      </div>
      {!!cardId && <ModalCardDetail id={cardId} isOpen={!!router.query.card} />}
    </Layout>
  );
};

export default BoardDetailPage;
