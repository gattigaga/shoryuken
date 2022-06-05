import Link from "next/link";
import React from "react";
import { MdEdit, MdOutlineCheckBox, MdSubject } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";

import useBoardQuery from "../hooks/boards/use-board-query";

type Props = {
  id: number;
  boardId: number;
  index: number;
  title: string;
  slug: string;
  totalChecks?: number;
  totalCompletedChecks?: number;
  hasDescription?: boolean;
  hasChecklist?: boolean;
};

const Card: React.FC<Props> = ({
  id,
  boardId,
  index,
  title,
  slug,
  totalChecks,
  totalCompletedChecks,
  hasDescription,
  hasChecklist,
}) => {
  const { data: board } = useBoardQuery(boardId);

  const isAllChecked =
    totalChecks === totalCompletedChecks && Number(totalChecks) > 0;

  return (
    <Draggable draggableId={`card-${id}`} index={index}>
      {(provided) => (
        <Link
          href={{
            pathname: `/boards/${board.slug}`,
            query: {
              card: `${id}-${slug}`,
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
                      <span className="text-slate-500 mr-2">
                        <MdSubject size={20} />
                      </span>
                    )}
                    {hasChecklist && (
                      <div
                        className={classnames(
                          "flex items-center rounded p-1 pr-2",
                          {
                            "bg-green-500": isAllChecked,
                            "text-white": isAllChecked,
                            "text-slate-500": !isAllChecked,
                          }
                        )}
                      >
                        <MdOutlineCheckBox className="mr-1" size={20} />
                        <span className="text-xs">
                          {totalCompletedChecks}/{totalChecks}
                        </span>
                      </div>
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
