"use client";

import Link from "next/link";
import React from "react";
import { MdEdit, MdOutlineCheckBox, MdSubject, MdTimer } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import { isAfter, isTomorrow, parseISO, format } from "date-fns";

type Props = {
  id: number;
  href: string;
  index: number;
  title: string;
  dueDate?: string;
  totalChecks?: number;
  totalCompletedChecks?: number;
  hasDescription?: boolean;
  hasChecklist?: boolean;
  isDueDateDone?: boolean;
  isDisabled?: boolean;
};

const Card: React.FC<Props> = ({
  id,
  href,
  index,
  title,
  dueDate,
  totalChecks,
  totalCompletedChecks,
  hasDescription,
  hasChecklist,
  isDueDateDone,
  isDisabled,
}) => {
  const isAllChecked =
    totalChecks === totalCompletedChecks && Number(totalChecks) > 0;

  const hasContent = !!dueDate || hasDescription || hasChecklist;

  const dueDateClassNames = (() => {
    if (dueDate) {
      const date = parseISO(dueDate);

      if (isDueDateDone) {
        return "border border-green-500 bg-green-500 text-white";
      }

      if (isTomorrow(date)) {
        return "bordeu-yellow-400 bg-yellow-400 text-white";
      }

      if (isAfter(new Date(), date)) {
        return "bg-red-600 text-white";
      }
    }

    return "border text-slate-700";
  })();

  const dueDateLabel = dueDate ? format(parseISO(dueDate), "MMM dd") : "";

  const content = (
    <>
      <div className="flex-1 mr-4">
        <p className="text-xs break-all">{title}</p>
        {hasContent && (
          <div className="flex items-center mt-2">
            {!!dueDate && (
              <div
                className={`flex items-center rounded py-1 px-1 pr-2 mr-2 ${dueDateClassNames}`}
              >
                <MdTimer size={18} />
                <p className="text-xs ml-1">{dueDateLabel}</p>
              </div>
            )}
            {hasDescription && (
              <span className="text-slate-500 mr-2">
                <MdSubject size={20} />
              </span>
            )}
            {hasChecklist && (
              <div
                className={classnames("flex items-center rounded p-1 pr-2", {
                  "bg-green-500": isAllChecked,
                  "text-white": isAllChecked,
                  "text-slate-500": !isAllChecked,
                })}
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
    </>
  );

  if (isDisabled) {
    return (
      <div className="mb-2 group p-2 bg-white rounded shadow flex hover:bg-slate-200">
        {content}
      </div>
    );
  }

  return (
    <Draggable draggableId={`card-${id}`} index={index}>
      {(provided) => (
        <Link href={href}>
          <div
            className="mb-2 group p-2 bg-white rounded shadow flex hover:bg-slate-200"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {content}
          </div>
        </Link>
      )}
    </Draggable>
  );
};

export default Card;
