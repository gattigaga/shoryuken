"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { MdAdd, MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import classnames from "classnames";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import useCreateListMutation from "../hooks/use-create-list-mutation";
import Button from "../../../../components/Button";

type Props = {
  boardId: number;
  onClickAdd?: () => void;
};

const CreateListForm: React.FC<Props> = ({ boardId, onClickAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const refContainer = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const { _ } = useLingui();
  const createListMutation = useCreateListMutation();

  const containerVariants = {
    closed: {
      height: 48,
      background: "rgb(59 130 246)", // bg-blue-500
      transition: {
        staggerChildren: 0.05,
        when: "afterChildren",
      },
    },
    opened: {
      height: 106,
      background: "rgb(203 213 225)", // bg-slate-300
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  };

  const openedVariants = {
    closed: {
      opacity: 0,
      display: "none",
    },
    opened: {
      opacity: 1,
      display: "block",
    },
  };

  const closedVariants = {
    closed: {
      opacity: 1,
      display: "flex",
    },
    opened: {
      opacity: 0,
      display: "none",
    },
  };

  const createList = async () => {
    if (!title) return;

    try {
      setTitle("");
      refInput.current?.focus();

      await createListMutation.mutateAsync({
        body: {
          title,
          board_id: boardId,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to create a list.`));
    }

    onClickAdd?.();
  };

  // Handle input autofocus when form opened.
  useEffect(() => {
    if (isOpen) {
      setTitle("");

      setTimeout(() => {
        refInput.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close form if outside is clicked.
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refContainer.current) {
        if (!refContainer.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={refContainer}
      className={classnames("shrink-0 w-72 rounded overflow-hidden", {
        "cursor-pointer": !isOpen,
      })}
      variants={containerVariants}
      initial="closed"
      animate={isOpen ? "opened" : "closed"}
      transition={{
        ease: "easeIn",
        duration: 0.2,
      }}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setIsOpen(true);
        }
      }}
    >
      {/* Opened */}
      <motion.div
        className="p-2"
        variants={openedVariants}
        initial="close"
        animate={isOpen ? "opened" : "closed"}
        transition={{
          ease: "easeIn",
          duration: 0.2,
        }}
      >
        <input
          ref={refInput}
          className="w-full py-3 rounded text-xs border-slate-400 outline-blue-500 mb-2"
          type="text"
          name="title"
          placeholder={_(msg`Enter list title...`)}
          value={title}
          maxLength={30}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            switch (event.key) {
              case "Enter":
                createList();
                break;

              case "Escape":
                setIsOpen(false);
                break;

              default:
                break;
            }
          }}
        />
        <div className="flex items-center">
          <Button
            className="outline-black mr-2"
            type="button"
            onClick={createList}
          >
            <Trans>Add list</Trans>
          </Button>
          <button
            className="text-slate-500 hover:text-slate-600"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <MdClose size={24} />
          </button>
        </div>
      </motion.div>

      {/* Closed */}
      <motion.div
        className="flex items-center px-4 h-full transition-all duration-200 hover:bg-blue-400"
        variants={closedVariants}
        initial="close"
        animate={isOpen ? "opened" : "closed"}
        transition={{
          ease: "easeIn",
          duration: 0.2,
        }}
        onClick={() => setIsOpen(true)}
      >
        <MdAdd color="white" size={24} />
        <p className="ml-2 text-xs text-white">
          <Trans>Create new list</Trans>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CreateListForm;
