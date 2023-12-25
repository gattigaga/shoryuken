"use client";

import Head from "next/head";
import Modal from "react-modal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdClose,
  MdDelete,
  MdErrorOutline,
  MdOutlineCheckBox,
  MdTimer,
} from "react-icons/md";
import toast from "react-hot-toast";
import Loading from "react-spinners/ScaleLoader";

import useCardQuery from "../hooks/use-card-query";
import useDeleteCardMutation from "../hooks/use-delete-card-mutation";
import useUpdateCardMutation from "../hooks/use-update-card-mutation";
import CardTitle from "./CardTitle";
import CardDescription from "./CardDescription";
import CardChecklist from "./CardChecklist";
import PopupDueDate from "./PopupDueDate";
import CardDueDate from "./CardDueDate";

type Props = {};

const ModalCardDetail: React.FC<Props> = ({}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const cardSlug = searchParams?.get("card");

  const cardId = (() => {
    const value = cardSlug?.split("-")[0];

    if (!value) return undefined;

    return Number(value);
  })();

  const [isPopupDueDateOpen, setIsPopupDueDateOpen] = useState(false);
  const cardQuery = useCardQuery(cardId);
  const deleteCardMutation = useDeleteCardMutation();
  const updateCardMutation = useUpdateCardMutation();

  const isOpen = !!cardSlug;
  const path = `/dashboard/boards/${params?.slug}`;

  const close = () => router.replace(path);

  const addChecklist = async () => {
    if (!cardQuery.data) return;

    if (cardQuery.data.has_checklist) {
      toast.error("This card already has checklist.");
      return;
    }

    try {
      await updateCardMutation.mutateAsync({
        id: cardQuery.data.id,
        listId: cardQuery.data.list_id,
        body: {
          has_checklist: true,
        },
      });
    } catch (error) {
      toast.error("Failed to add checklist in the card.");
    }
  };

  const deleteCard = async () => {
    if (!cardQuery.data) return;

    const isYes = confirm("Are you sure you want to delete this card ?");

    if (isYes) {
      try {
        router.replace(path);

        await deleteCardMutation.mutateAsync({
          id: cardQuery.data.id,
          listId: cardQuery.data.list_id,
        });
      } catch (error) {
        toast.error("Failed to delete a card.");
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      cardQuery.refetch();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      overlayClassName="fixed inset-0 bg-black/50 overflow-y-auto"
      className="border-0 p-0 absolute top-4 left-1/2 bottom-auto -translate-x-1/2 bg-transparent w-[90%] h-auto max-w-4xl md:top-16"
    >
      <Head>
        <title>
          {cardQuery.data?.title && `${cardQuery.data.title} | `}Shoryuken
        </title>
      </Head>

      <div className="w-full rounded bg-slate-100 p-5 pb-10 min-h-[480px] flex flex-col">
        {cardQuery.status === "success" && (
          <>
            {/* Header Side */}
            <div className="flex items-start">
              <CardTitle id={cardQuery.data.id} />
              <button
                className="text-slate-500 ml-12"
                type="button"
                onClick={close}
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                {!!cardQuery.data.due_dates.length && (
                  <CardDueDate id={cardQuery.data.id} />
                )}
                <CardDescription id={cardQuery.data.id} />
                {cardQuery.data.has_checklist && (
                  <CardChecklist id={cardQuery.data.id} />
                )}
              </div>

              {/* Right Side Menu */}
              <div className="w-full mt-16 relative md:mt-0 md:w-48 md:ml-16">
                <div className="mb-8">
                  <p className="font-semibold text-xs text-slate-700 mb-3">
                    Add to card
                  </p>
                  <button
                    className="flex items-center rounded bg-slate-200 hover:bg-slate-300 text-slate-700 w-full px-2 py-2 mb-1"
                    type="button"
                    onClick={addChecklist}
                  >
                    <MdOutlineCheckBox size={20} />
                    <p className="text-sm ml-3">Checklist</p>
                  </button>
                  <button
                    className="flex items-center rounded bg-slate-200 hover:bg-slate-300 text-slate-700 w-full px-2 py-2"
                    type="button"
                    onClick={() => {
                      if (!!cardQuery.data.due_dates.length) {
                        toast.error("This card already has due date.");
                        return;
                      }

                      setIsPopupDueDateOpen(true);
                    }}
                  >
                    <MdTimer size={20} />
                    <p className="text-sm ml-3">Due Date</p>
                  </button>

                  {/* Popup Parts */}
                  <PopupDueDate
                    id={cardQuery.data.id}
                    usage="add"
                    isOpen={isPopupDueDateOpen}
                    onClickClose={() => setIsPopupDueDateOpen(false)}
                  />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-700 mb-3">
                    Actions
                  </p>
                  <button
                    className="flex items-center rounded bg-red-700 hover:bg-red-800 text-white w-full px-2 py-2"
                    type="button"
                    onClick={deleteCard}
                  >
                    <MdDelete size={20} />
                    <p className="text-sm ml-3">Delete</p>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {cardQuery.status === "loading" && (
          <div className="flex-1 flex justify-center items-center">
            <Loading
              height={36}
              width={4}
              radius={8}
              margin={2}
              color="rgb(203 213 225)"
            />
          </div>
        )}
        {cardQuery.status === "error" && (
          <div className="flex-1 flex flex-col justify-center items-center">
            <MdErrorOutline size={48} color="rgb(203 213 225)" />
            <p className="text-xs text-slate-700 mt-4">
              Failed to fetch card detail.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalCardDetail;
