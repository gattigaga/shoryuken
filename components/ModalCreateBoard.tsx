import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";

import Button from "./Button";
import useBoardMutation from "../hooks/boards/use-board-mutation";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title should have at least 5 characters")
    .max(50, "Title should have maximum 50 characters")
    .required("Title is required"),
});

type Props = {
  isOpen: boolean;
  onRequestClose?: () => void;
};

const ModalCreateBoard: React.FC<Props> = ({ isOpen, onRequestClose }) => {
  const refInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const createBoardMutation = useBoardMutation();

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
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async (values) => {
          try {
            await createBoardMutation.mutateAsync(values);

            queryClient.invalidateQueries("boards");
            toast.success("Board successfully created.");
          } catch (error) {
            toast.error("Failed to create a board.");
          } finally {
            onRequestClose?.();
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 h-32 w-80 bg-blue-700 rounded mb-4">
                <input
                  ref={refInput}
                  className="bg-blue-600 text-md text-white font-semibold border-none w-full rounded px-2"
                  name="title"
                  type="text"
                  value={values.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={!!errors.title || isSubmitting}
              >
                Create Board
              </Button>
            </form>
          </div>
        )}
      </Formik>
    </Modal>
  );
};

export default ModalCreateBoard;
