import Link from "next/link";
import React from "react";
import { MdEdit, MdSubject } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";

import useBoardQuery from "../hooks/boards/use-board-query";

type Props = {
  id: number;
  boardId: number;
  index: number;
  title: string;
  slug: string;
  hasDescription?: boolean;
};

const Card: React.FC<Props> = ({
  id,
  boardId,
  index,
  title,
  slug,
  hasDescription,
}) => {
  const { data: board } = useBoardQuery(boardId);

  return (
    <Draggable draggableId={`card-${id}`} index={index}>
      {(provided) => (
        <Link
          href={{
            pathname: `/boards/${board.slug}`,
            query: {
              card: slug,
            },
          }}
        >
          <a>
            <div
              className="mb-2 group p-2 bg-white rounded shadow flex hover:bg-slate-200"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="flex-1 mr-4">
                <p className="text-xs break-all">{title}</p>
                {hasDescription && (
                  <div className="flex items-center mt-2">
                    {hasDescription && (
                      <span className="text-slate-500">
                        <MdSubject size={20} />
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-white group-hover:text-slate-500">
                <MdEdit size={16} />
              </span>
            </div>
          </a>
        </Link>
      )}
    </Draggable>
  );
};

export default Card;
