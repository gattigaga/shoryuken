"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import BoardTitle from "./BoardTitle";
import useBoardQuery from "../hooks/use-board-query";
import useDeleteBoardMutation from "../hooks/use-delete-board-mutation";
import useListsQuery from "../hooks/use-lists-query";
import ModalCardDetail from "./ModalCardDetail";
import NotFound from "./NotFound";
import DragDropArea from "./DragDropArea";
import { getTailwindColors } from "../../../helpers/others";
import { Board as TBoard, List as TList } from "../../../../types/models";

type Props = {
  board?: TBoard;
  lists?: TList[];
};

const Content: FC<Props> = ({ board, lists }) => {
  const router = useRouter();
  const { _ } = useLingui();

  const boardId = board?.id || 0;

  const boardQuery = useBoardQuery(boardId, board);
  const listsQuery = useListsQuery(boardId, lists);
  const deleteBoardMutation = useDeleteBoardMutation();

  const isLoading = boardQuery.isLoading || deleteBoardMutation.isLoading;
  const isContentShow = boardQuery.isSuccess && deleteBoardMutation.isIdle;
  const boardColor = boardQuery.data?.color || "blue";

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

  return (
    <>
      <div className="root h-screen flex flex-col">
        {isContentShow && (
          <>
            <div className="flex items-center my-4 px-4">
              <Link href="/dashboard" className="mr-4">
                <div className="btn w-8 h-8 rounded flex items-center justify-center">
                  <MdChevronLeft color="white" size={24} />
                </div>
              </Link>
              <BoardTitle id={boardQuery.data.id} />
              <button
                className="btn ml-6 px-2 text-xs h-8 text-white font-semibold rounded items-center justify-center"
                type="button"
                onClick={deleteBoard}
              >
                <Trans>Delete</Trans>
              </button>
            </div>
            <div className="flex-1 flex pb-4 px-4">
              {listsQuery.isSuccess && (
                <DragDropArea board={boardQuery.data} lists={listsQuery.data} />
              )}
              {listsQuery.isLoading && (
                <div className="h-full w-full flex justify-center items-center">
                  <Loading
                    height={72}
                    width={8}
                    radius={16}
                    margin={4}
                    color={getTailwindColors(boardColor, 700)}
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
              color={getTailwindColors(boardColor, 700)}
            />
          </div>
        )}

        {boardQuery.isError && <NotFound />}

        <style jsx>{`
          .root {
            background: ${getTailwindColors(boardColor, 600)};
          }

          .btn {
            background: ${getTailwindColors(boardColor, 500)};
          }

          .scroll::-webkit-scrollbar {
            height: 0.75rem;
          }

          .scroll::-webkit-scrollbar-track {
            background: ${getTailwindColors(boardColor, 700)};
            border-radius: 1rem;
          }

          .scroll::-webkit-scrollbar-thumb {
            background: ${getTailwindColors(boardColor, 400)};
            border-radius: 1rem;
          }
        `}</style>
      </div>
      <ModalCardDetail />
    </>
  );
};

export default Content;
