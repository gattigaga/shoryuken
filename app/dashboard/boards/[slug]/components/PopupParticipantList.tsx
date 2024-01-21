"use client";

import { FC } from "react";
import { MdClose } from "react-icons/md";
import { Trans, plural } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import Spinner from "react-spinners/ScaleLoader";
import styled from "styled-components";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import useBoardMembersQuery from "../hooks/use-board-members-query";
import { getInitials } from "../../../../helpers/formatter";
import { getAvatarUrl, getTailwindColors } from "../../../helpers/others";
import { Board } from "../../../../types/models";
import useUserQuery from "../../../hooks/use-user-query";

const StyledDialogOverlay = styled(Dialog.Overlay)`
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledDialogContent = styled(Dialog.Overlay)`
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

type Member = {
  id: number;
  fullname: string;
};

type Props = {
  board: Board;
  isOpen: boolean;
  onRequestClose?: () => void;
  onClickDeleteMember?: (member: Member) => void;
};

const PopupParticipantList: FC<Props> = ({
  board,
  isOpen,
  onRequestClose,
  onClickDeleteMember,
}) => {
  const { _ } = useLingui();
  const userQuery = useUserQuery();
  const boardMembersQuery = useBoardMembersQuery(board.id);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onRequestClose}>
      <Dialog.Portal>
        <StyledDialogOverlay className="bg-black/50 fixed inset-0" />
        <StyledDialogContent className="bg-white rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg min-h-48 max-h-[50vh] p-6 focus:outline-none">
          {boardMembersQuery.isSuccess && (
            <>
              <Dialog.Title className="mb-4 text-slate-700 text-lg font-semibold">
                <Trans>Participants</Trans>
              </Dialog.Title>
              <Dialog.Description className="mb-2 text-slate-500 text-sm leading-relaxed">
                {plural(boardMembersQuery.data.length + 1, {
                  one: "There's one participant found.",
                  other: "There are # participants found.",
                })}
              </Dialog.Description>

              <ScrollArea.Root className="w-full h-40">
                <ScrollArea.Viewport className="w-full h-full">
                  {/* Owner */}
                  <div className="flex items-center py-2 border-b select-none group">
                    <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-6 h-6 rounded-full">
                      {board.user.raw_user_meta_data.avatar && (
                        <Avatar.Image
                          className="w-full h-full object-cover"
                          src={getAvatarUrl(
                            board.user.raw_user_meta_data.avatar
                          )}
                          alt={board.user.raw_user_meta_data.fullname}
                        />
                      )}
                      <Avatar.Fallback
                        style={{
                          background: getTailwindColors(board.color, 600),
                        }}
                        className="w-full h-full flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {getInitials(board.user.raw_user_meta_data.fullname)}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <p className="ml-2 text-xs text-slate-500 duration-200 transition-all group-hover:text-slate-700 group-hover:font-semibold">
                      {board.user?.raw_user_meta_data.fullname}
                    </p>

                    <p className="ml-2 text-xs text-slate-500">
                      (<Trans>Owner</Trans>)
                    </p>
                  </div>

                  {/* Members */}
                  {boardMembersQuery.data.map((member) => {
                    const isDeletable = userQuery.data?.id === board.user_id;

                    return (
                      <div
                        className="flex items-center py-2 border-b select-none group"
                        key={member.id}
                      >
                        <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-6 h-6 rounded-full">
                          {member.user.raw_user_meta_data.avatar && (
                            <Avatar.Image
                              className="w-full h-full object-cover"
                              src={getAvatarUrl(
                                member.user.raw_user_meta_data.avatar
                              )}
                              alt={member.user.raw_user_meta_data.fullname}
                            />
                          )}
                          <Avatar.Fallback
                            style={{
                              background: getTailwindColors(board.color, 600),
                            }}
                            className="w-full h-full flex items-center justify-center text-white text-xs font-semibold"
                          >
                            {getInitials(
                              member.user.raw_user_meta_data.fullname
                            )}
                          </Avatar.Fallback>
                        </Avatar.Root>

                        <p className="ml-2 text-xs text-slate-500 duration-200 transition-all group-hover:text-slate-700 group-hover:font-semibold">
                          {member.user.raw_user_meta_data.fullname}
                        </p>

                        {isDeletable && (
                          <button
                            className="ml-auto mr-6 text-slate-500"
                            type="button"
                            onClick={() => {
                              onClickDeleteMember?.({
                                id: member.id,
                                fullname:
                                  member.user?.raw_user_meta_data.fullname ||
                                  "",
                              });
                            }}
                          >
                            <MdClose />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none rounded-full bg-slate-300 data-[orientation=vertical]:w-3"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-slate-400 rounded-full relative" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </>
          )}

          {boardMembersQuery.isLoading && (
            <div className="flex justify-center items-center py-4 h-40">
              <Spinner
                height={36}
                width={4}
                radius={8}
                margin={2}
                color="rgb(29 78 216)"
              />
            </div>
          )}

          <Dialog.Close asChild>
            <button
              className="rounded-full w-6 h-6 inline-flex items-center justify-center text-slate-700 absolute top-4 right-4 hover:bg-slate-200 focus:shadow"
              type="button"
              aria-label="Close"
            >
              <MdClose />
            </button>
          </Dialog.Close>
        </StyledDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PopupParticipantList;
