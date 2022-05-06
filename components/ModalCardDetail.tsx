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
        await router.replace(path);

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
      overlayClassName="fixed inset-0 bg-black/50"
      className="border-0 p-0 absolute top-0 left-1/2 bottom-auto -translate-x-1/2 bg-transparent w-[90%] h-auto max-w-4xl"
    >
      <Head>
        <title>{card?.title && `${card.title} | Shoryuken`}</title>
      </Head>

      <div className="py-4 w-full md:py-16">
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

          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              <CardDescription id={id} />
            </div>

            {/* Right Side Menu */}
            <div className="w-full mt-16 md:mt-0 md:w-48 md:ml-16">
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
