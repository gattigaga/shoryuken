"use client";

import { FC, useEffect, useRef } from "react";
import Modal from "react-modal";
import { Formik } from "formik";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Button from "../../components/Button";
import useCreateBoardMutation from "../hooks/use-create-board-mutation";

type Props = {
  isOpen: boolean;
  onRequestClose?: () => void;
};

const ModalCreateBoard: FC<Props> = ({ isOpen, onRequestClose }) => {
  const refInput = useRef<HTMLInputElement>(null);
  const { _ } = useLingui();
  const createBoardMutation = useCreateBoardMutation();

  const validationSchema = z.object({
    title: z
      .string({ required_error: _(msg`Title is required`) })
      .min(5, _(msg`Title should have at least 5 characters`))
      .max(50, _(msg`Title should no more than 50 characters`)),
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        refInput.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          background: "rgba(0, 0, 0, 0.75)",
        },
        content: {
          left: "50%",
          transform: "translateX(-50%)",
          width: "23rem",
          height: "12rem",
          padding: 0,
          background: "transparent",
          border: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      <Formik
        initialValues={{
          title: "",
        }}
        validationSchema={toFormikValidationSchema(validationSchema)}
        validateOnMount
        onSubmit={async (values) => {
          onRequestClose?.();

          try {
            await createBoardMutation.mutateAsync({
              body: values,
            });
          } catch (error) {
            toast.error(_(msg`Failed to create a board.`));
          }
        }}
      >
        {({ values, errors, isSubmitting, handleChange, handleSubmit }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 h-32 w-80 bg-blue-700 rounded mb-4">
                <input
                  ref={refInput}
                  className="bg-blue-600 text-md text-white font-semibold border-none w-full rounded px-2"
                  name="title"
                  type="text"
                  value={values.title}
                  disabled={isSubmitting}
                  onChange={handleChange}
                />
              </div>
              <Button
                backgroundColor={["bg-green-600", "bg-green-700"]}
                disabled={!!errors.title || isSubmitting}
              >
                <Trans>Create Board</Trans>
              </Button>
            </form>
          </div>
        )}
      </Formik>
    </Modal>
  );
};

export default ModalCreateBoard;
