"use client";

import { FC } from "react";
import { MdClose } from "react-icons/md";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Formik } from "formik";
import Spinner from "react-spinners/ScaleLoader";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

import useCreateBoardMemberMutation from "../hooks/use-create-board-member-mutation";
import useBoardMembersQuery from "../hooks/use-board-members-query";
import Input from "../../../../components/Input";

type Props = {
  boardId: number;
  isOpen: boolean;
  onRequestClose?: () => void;
};

const PopupAddMember: FC<Props> = ({ boardId, isOpen, onRequestClose }) => {
  const { _ } = useLingui();
  const boardMembersQuery = useBoardMembersQuery(boardId);
  const createBoardMemberMutation = useCreateBoardMemberMutation();

  const validationSchema = z.object({
    email: z
      .string({ required_error: _(msg`Email is required`) })
      .email(_(msg`Invalid email format`)),
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onRequestClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay bg-black/50 fixed inset-0" />
        <Dialog.Content className="dialog-content bg-white rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg min-h-48 max-h-[50vh] p-6 focus:outline-none">
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={toFormikValidationSchema(validationSchema)}
            validateOnChange={false}
            validateOnBlur={true}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);

                await createBoardMemberMutation.mutateAsync({
                  body: {
                    board_id: boardId,
                    email: values.email,
                  },
                });

                await boardMembersQuery.refetch();

                onRequestClose?.();
                toast.success(_(msg`Member successfully added.`));
              } catch (error) {
                toast.error(_(msg`Failed to add a member.`));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <>
                {isSubmitting ? (
                  <div className="flex justify-center items-center py-4 h-40">
                    <Spinner
                      height={36}
                      width={4}
                      radius={8}
                      margin={2}
                      color="rgb(29 78 216)"
                    />
                  </div>
                ) : (
                  <>
                    <Dialog.Title className="mb-4 text-slate-700 text-lg font-semibold">
                      Add new member
                    </Dialog.Title>
                    <Dialog.Description className="mb-2 text-slate-500 text-sm leading-relaxed">
                      Please enter a member email to add him to this board.
                    </Dialog.Description>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <Input
                          className="w-full"
                          type="text"
                          name="email"
                          value={values.email}
                          placeholder={_(msg`Enter email`)}
                          errorMessage={errors.email}
                          isError={!!touched.email && !!errors.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <div className="flex mt-8 justify-end">
                        <button className="inline-flex items-center justify-center rounded px-2 h-8 text-xs font-semibold bg-green-200 text-green-700">
                          <Trans>Add Member</Trans>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </Formik>

          <Dialog.Close asChild>
            <button
              className="rounded-full w-6 h-6 inline-flex items-center justify-center text-slate-700 absolute top-4 right-4 hover:bg-slate-200 focus:shadow"
              type="button"
              aria-label="Close"
            >
              <MdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>

      <style jsx>{`
        :global(.dialog-overlay) {
          animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        :global(.dialog-content) {
          animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes overlayShow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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
      `}</style>
    </Dialog.Root>
  );
};

export default PopupAddMember;
