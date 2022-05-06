import Head from "next/head";
import Modal from "react-modal";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";

import useCardQuery from "../hooks/cards/use-card-query";
import CardTitle from "./CardTitle";
import CardDescription from "./CardDescription";

type Props = {
  id: number;
  isOpen: boolean;
  onRequestClose?: () => void;
};

const ModalCardDetail: React.FC<Props> = ({ id, isOpen, onRequestClose }) => {
  const { data: card, refetch } = useCardQuery(id);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
        <div className="w-full rounded bg-slate-200 p-5 pb-10">
          <div className="flex items-start">
            <CardTitle id={id} />
            <button
              className="text-slate-500 ml-12"
              type="button"
              onClick={onRequestClose}
            >
              <MdClose size={24} />
            </button>
          </div>
          <CardDescription id={id} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalCardDetail;
