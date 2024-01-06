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
import { getTailwindColors } from "../helpers/others";

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

  const colors = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];

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
          height: "18rem",
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
          color: "red",
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
        {({
          values,
          errors,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleSubmit,
        }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  backgroundColor: getTailwindColors(values.color, 700),
                }}
                className="p-4 h-32 w-80 rounded mb-4"
              >
                <input
                  ref={refInput}
                  style={{
                    backgroundColor: getTailwindColors(values.color, 600),
                  }}
                  className="text-md text-white font-semibold border-none w-full rounded px-2"
                  name="title"
                  type="text"
                  value={values.title}
                  disabled={isSubmitting}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-8 grid-rows-2 gap-2 mb-4">
                {colors.map((color) => {
                  const isSelected = values.color === color;
                  const colorValue = getTailwindColors(color, 500);

                  return (
                    <button
                      style={{
                        backgroundColor: colorValue,
                        borderColor: isSelected ? "white" : colorValue,
                      }}
                      className="aspect-square rounded border-2"
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("color", color)}
                    />
                  );
                })}
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
