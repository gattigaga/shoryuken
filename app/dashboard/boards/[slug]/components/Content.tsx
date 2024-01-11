"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdChevronLeft, MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import classNames from "classnames";
import * as Avatar from "@radix-ui/react-avatar";
import * as Tooltip from "@radix-ui/react-tooltip";

import BoardTitle from "./BoardTitle";
import useBoardQuery from "../hooks/use-board-query";
import useDeleteBoardMutation from "../hooks/use-delete-board-mutation";
import useListsQuery from "../hooks/use-lists-query";
import ModalCardDetail from "./ModalCardDetail";
import NotFound from "./NotFound";
import DragDropArea from "./DragDropArea";
import { getTailwindColors } from "../../../helpers/others";
import {
  Board as TBoard,
  BoardMember as TBoardMember,
  List as TList,
} from "../../../../types/models";
import useBoardMembersQuery from "../hooks/use-board-members-query";
import useCreateBoardMemberMutation from "../hooks/use-create-board-member-mutation";
import useDeleteBoardMemberMutation from "../hooks/use-delete-board-member-mutation";
import { getInitials } from "../../../../helpers/formatter";
import PopupAddMember from "./PopupAddMember";
import PopupDeleteMemberConfirmation from "./PopupDeleteMemberConfirmation";

type Participant = TBoardMember["user"] & {
  member_id: number | null;
};

type Props = {
  board?: TBoard;
  boardMembers?: TBoardMember[];
  lists?: TList[];
};

const Content: FC<Props> = ({ board, boardMembers, lists }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [tmpMember, setTmpMember] = useState<Participant | null>(null);
  const [isPopupAddMemberOpen, setIsPopupAddMemberOpen] = useState(false);
  const router = useRouter();
  const { _ } = useLingui();

  const boardId = board?.id || 0;

  const boardQuery = useBoardQuery(boardId, board);
  const listsQuery = useListsQuery(boardId, lists);
  const boardMembersQuery = useBoardMembersQuery(boardId, boardMembers);
  const deleteBoardMutation = useDeleteBoardMutation();
  const createBoardMemberMutation = useCreateBoardMemberMutation();
  const deleteBoardMemberMutation = useDeleteBoardMemberMutation();

  const isBoardMembersLoading =
    boardMembersQuery.isLoading ||
    createBoardMemberMutation.isLoading ||
    deleteBoardMemberMutation.isLoading;

  const isBoardMembersShow =
    boardMembersQuery.isSuccess &&
    !createBoardMemberMutation.isLoading &&
    !deleteBoardMemberMutation.isLoading;

  const isLoading = boardQuery.isLoading || deleteBoardMutation.isLoading;
  const isContentShow = boardQuery.isSuccess && deleteBoardMutation.isIdle;
  const boardColor = boardQuery.data?.color || "blue";
  const maxParticipantsShow = 5;

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

  const deleteMember = async () => {
    if (!tmpMember?.member_id) return;

    try {
      await deleteBoardMemberMutation.mutateAsync({
        id: tmpMember.member_id,
      });

      await boardMembersQuery.refetch();

      toast.success(_(msg`Member successfully deleted.`));
    } catch (error) {
      toast.error(_(msg`Failed to delete a member.`));
    }
  };

  // Set participants.
  useEffect(() => {
    const owner: Participant | undefined = boardQuery.data?.user && {
      ...boardQuery.data.user,
      member_id: null,
    };

    const members: Participant[] =
      boardMembersQuery.data?.map((member) => ({
        ...member.user,
        member_id: member.id,
      })) || [];

    const newParticipants = members.concat(owner ? [owner] : []);

    setParticipants(newParticipants);
  }, [boardQuery.data, boardMembersQuery.data]);

  return (
    <>
      <div
        style={{
          background: getTailwindColors(boardColor, 600),
        }}
        className="h-screen flex flex-col"
      >
        {isContentShow && (
          <>
            <div className="flex items-center justify-between my-4 px-4">
              <div className="flex items-center">
                <Link href="/dashboard" className="mr-4">
                  <div
                    style={{ background: getTailwindColors(boardColor, 500) }}
                    className="w-8 h-8 rounded flex items-center justify-center"
                  >
                    <MdChevronLeft color="white" size={24} />
                  </div>
                </Link>
                <BoardTitle id={boardQuery.data.id} />
                <button
                  style={{ background: getTailwindColors(boardColor, 500) }}
                  className="ml-6 px-2 text-xs h-8 text-white font-semibold rounded items-center justify-center"
                  type="button"
                  onClick={deleteBoard}
                >
                  <Trans>Delete</Trans>
                </button>
              </div>

              {isBoardMembersShow && (
                <div className="flex items-center">
                  {participants
                    .slice(0, maxParticipantsShow)
                    .map((participant, index) => (
                      <div
                        style={{
                          borderColor: getTailwindColors(boardColor, 600),
                        }}
                        className={classNames("border-2 rounded-full", {
                          "-ml-2": index > 0,
                        })}
                        key={participant.id}
                      >
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Avatar.Root
                              className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-6 h-6 rounded-full"
                              onClick={() => {
                                if (participant.member_id) {
                                  setTmpMember(participant);
                                }
                              }}
                            >
                              <Avatar.Fallback
                                style={{
                                  color: getTailwindColors(boardColor, 600),
                                }}
                                className="w-full h-full flex items-center justify-center bg-white text-xs font-semibold"
                              >
                                {getInitials(
                                  participant.raw_user_meta_data.fullname
                                )}
                              </Avatar.Fallback>
                            </Avatar.Root>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              style={{
                                background: getTailwindColors(boardColor, 950),
                              }}
                              className="rounded px-4 py-2 leading-none text-xs text-white shadow-md select-none"
                              sideOffset={5}
                              side="bottom"
                            >
                              {participant.raw_user_meta_data.fullname}
                              <Tooltip.Arrow
                                style={{
                                  fill: getTailwindColors(boardColor, 950),
                                }}
                              />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </div>
                    ))}
                  {participants.length > maxParticipantsShow && (
                    <div
                      style={{
                        borderColor: getTailwindColors(boardColor, 600),
                      }}
                      className="border-2 rounded-full -ml-2"
                    >
                      <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-6 h-6 rounded-full">
                        <Avatar.Fallback
                          style={{
                            color: getTailwindColors(boardColor, 600),
                          }}
                          className="w-full h-full flex items-center justify-center bg-white text-xs font-semibold"
                        >
                          +{participants.length - maxParticipantsShow}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                  )}

                  <button
                    style={{ background: getTailwindColors(boardColor, 500) }}
                    className="ml-4 w-8 h-8 text-white rounded flex items-center justify-center"
                    type="button"
                    onClick={() => setIsPopupAddMemberOpen(true)}
                  >
                    <MdAdd color="white" size={20} />
                  </button>
                </div>
              )}

              {isBoardMembersLoading && (
                <div>
                  <Loading
                    height={24}
                    width={4}
                    radius={16}
                    margin={2}
                    color={getTailwindColors(boardColor, 700)}
                  />
                </div>
              )}
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
      </div>

      {tmpMember?.member_id && (
        <PopupDeleteMemberConfirmation
          member={{
            id: tmpMember.member_id,
            fullname: tmpMember.raw_user_meta_data.fullname,
          }}
          isOpen={!!tmpMember}
          onRequestClose={() => setTmpMember(null)}
          onClickConfirm={deleteMember}
        />
      )}

      <PopupAddMember
        boardId={boardId}
        isOpen={isPopupAddMemberOpen}
        onRequestClose={() => setIsPopupAddMemberOpen(false)}
      />

      <ModalCardDetail />
    </>
  );
};

export default Content;
