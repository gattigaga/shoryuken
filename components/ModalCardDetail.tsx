import Head from "next/head";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

import useCardQuery from "../hooks/cards/use-card-query";
import useDeleteCardMutation from "../hooks/cards/use-delete-card-mutation";
import CardTitle from "./CardTitle";
import CardDescription from "./CardDescription";

type Props = {
  id: number;
  isOpen: boolean;
};

const ModalCardDetail: React.FC<Props> = ({ id, isOpen }) => {
  const { data: card, refetch } = useCardQuery(id);
  const deleteCardMutation = useDeleteCardMutation();
  const router = useRouter();

  const path = `/boards/${router.query.slug}`;

  const close = () => router.push(path);

  const deleteCard = async () => {
    const isYes = confirm("Are you sure you want to delete this card ?");

    if (isYes) {
      try {
        await close();

        await deleteCardMutation.mutateAsync({
          id,
          listId: card.list_id,
        });
      } catch (error) {
        toast.error("Failed to delete a card.");
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      style={{
        overlay: {
          background: "rgba(0, 0, 0, 0.5)",
          overflowY: "auto",
        },
        content: {
          background: "transparent",
          top: "0%",
          left: "50%",
          bottom: "auto",
          transform: "translateX(-50%)",
          width: "66.666667%",
          height: "auto",
          padding: 0,
          border: 0,
        },
      }}
    >
      <Head>
        <title>{card?.title && `${card.title} | Shoryuken`}</title>
      </Head>

      <div className="py-12 w-full">
        <div className="w-full rounded bg-slate-100 p-5 pb-10">
          {/* Header Side */}
          <div className="flex items-start">
            <CardTitle id={id} />
            <button
              className="text-slate-500 ml-12"
              type="button"
              onClick={close}
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="flex">
            <div className="flex-1">
              <CardDescription id={id} />
            </div>

            {/* Right Side Menu */}
            <div className="w-48 ml-16">
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
      </div>
    </Modal>
  );
};

export default ModalCardDetail;
