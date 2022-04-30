import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MdChevronLeft } from "react-icons/md";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Layout from "../../components/Layout";
import supabase from "../../helpers/supabase";
import EditableText from "../../components/EditableText";
import { deleteBoardById, getBoardById, putBoardById } from "../../api/boards";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import CreateListButton from "../../components/CreateListButton";
import CreateListForm from "../../components/CreateListForm";
import List from "../../components/List";
import {
  deleteListById,
  getListsByBoardId,
  postList,
  putListById,
} from "../../api/lists";
import { moveElement } from "../../helpers/data-structures";
import { withAuthGuard } from "../../helpers/server";

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
    id: string;
    title: string;
    slug: string;
  };
};

const BoardDetailPage: React.FC<Props> = ({ initialBoard }) => {
  const [isCreateListFormOpen, setIsCreateListFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: board } = useQuery(
    "boardDetail",
    getBoardById(initialBoard.id),
    {
      initialData: initialBoard,
    }
  );

  const { data: lists } = useQuery(
    "lists",
    () => getListsByBoardId({ board_id: initialBoard.id }),
    {
      initialData: [],
    }
  );

  const boardUpdateMutation = useMutation(putBoardById(board.id), {
    onSuccess: () => {
      queryClient.invalidateQueries("boardDetail");
    },
    onError: () => {
      toast.error("Failed to update board title.");
    },
  });

  const boardDeleteMutation = useMutation(deleteBoardById(board.id), {
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete a board.");
    },
  });

  const listCreateMutation = useMutation(postList, {
    onSuccess: () => {
      queryClient.invalidateQueries("lists");
      toast.success("List successfully created.");
      setIsCreateListFormOpen(false);
    },
    onError: () => {
      toast.error("Failed to create a list.");
      setIsCreateListFormOpen(false);
    },
  });

  const listUpdateMutation = useMutation(putListById, {
    onSuccess: () => {
      queryClient.invalidateQueries("lists");
    },
    onError: () => {
      toast.error("Failed to update a list.");
    },
  });

  const listDeleteMutation = useMutation(deleteListById, {
    onSuccess: () => {
      queryClient.invalidateQueries("lists");
      toast.success("List successfully deleted.");
    },
    onError: () => {
      toast.error("Failed to delete a list.");
    },
  });

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
          <EditableText
            value={board.title}
            onSubmit={(value) => {
              boardUpdateMutation.mutate({
                title: value,
              });
            }}
          />
          <button
            className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
            onClick={() => boardDeleteMutation.mutate()}
          >
            Delete
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <div className="flex items-start">
            <DragDropContext
              onDragEnd={(result) => {
                const id = result.draggableId.replace("list-", "");
                const index = result.destination?.index;

                if (index === undefined) return;

                listUpdateMutation.mutate({
                  id,
                  body: {
                    index,
                  },
                });

                const newLists = moveElement(
                  lists,
                  result.source.index,
                  index
                ).map((list, index) => ({
                  ...list,
                  index,
                }));

                queryClient.setQueryData("lists", newLists);
              }}
            >
              <div className="shrink-0 w-4 h-4" />
              <Droppable droppableId="lists" direction="horizontal">
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
                        index={index}
                        title={list.title}
                        onSubmitTitle={(title) => {
                          if (!title) return;

                          listUpdateMutation.mutate({
                            id: list.id,
                            body: {
                              title,
                            },
                          });
                        }}
                        onClickRemove={() => {
                          listDeleteMutation.mutate({ id: list.id });
                        }}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {isCreateListFormOpen ? (
                <CreateListForm
                  onRequestClose={() => setIsCreateListFormOpen(false)}
                  onSubmit={(title) => {
                    if (!title) return;

                    listCreateMutation.mutate({
                      body: {
                        title,
                        board_id: board.id,
                      },
                    });
                  }}
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
    </Layout>
  );
};

export default BoardDetailPage;
