import React, { useState } from "react";
import {
  isAfter,
  isToday,
  isTomorrow,
  parseISO,
  format,
  isYesterday,
} from "date-fns";
import toast from "react-hot-toast";

import useUpdateDueDateMutation from "../hooks/due-dates/use-update-due-date-mutation";
import useCardQuery from "../hooks/cards/use-card-query";
import PopupDueDate from "./PopupDueDate";

type Props = {
  id: number;
};

const CardDueDate: React.FC<Props> = ({ id }) => {
  const [isPopupDueDateOpen, setIsPopupDueDateOpen] = useState(false);
  const cardQuery = useCardQuery(id);
  const updateDueDateMutation = useUpdateDueDateMutation();

  const dueDate = cardQuery.data?.due_dates[0];

  const dateLabel = (() => {
    if (dueDate) {
      const date = parseISO(dueDate.timestamp);

      if (isToday(date)) {
        return format(date, "'Today at' KK:mm aa");
      }

      if (isTomorrow(date)) {
        return format(date, "'Tomorrow at' KK:mm aa");
      }

      if (isYesterday(date)) {
        return format(date, "'Yesterday at' KK:mm aa");
      }

      return format(date, "MMM dd 'at' KK:mm aa");
    }

    return "Unknown";
  })();

  const status = (() => {
    if (dueDate) {
      const date = parseISO(dueDate.timestamp);

      if (dueDate.is_done) {
        return "complete";
      }

      if (isTomorrow(date)) {
        return "due_soon";
      }

      if (isAfter(new Date(), date)) {
        return "overdue";
      }
    }

    return "idle";
  })();

  const toggleDoneStatus = async (isDone: boolean) => {
    if (!dueDate || !cardQuery.data) return;

    try {
      await updateDueDateMutation.mutateAsync({
        id: dueDate.id,
        listId: cardQuery.data.list_id,
        cardId: id,
        body: {
          is_done: isDone,
        },
      });
    } catch (error) {
      toast.error("Failed to toggle check due date.");
    }
  };

  return (
    <div className="flex items-center mb-8 ml-9 relative">
      <input
        className="rounded border-2 border-slate-300 w-5 h-5 mr-2"
        type="checkbox"
        checked={!!dueDate?.is_done}
        onChange={(event) => toggleDoneStatus(event.target.checked)}
      />
      <button
        className="flex items-center bg-slate-200 rounded px-3 py-2 hover:bg-slate-300"
        type="button"
        onClick={() => setIsPopupDueDateOpen(true)}
      >
        <p className="text-xs text-slate-700">{dateLabel}</p>
        {status === "complete" && (
          <span className="text-xs text-white bg-green-500 rounded py-1 px-2 ml-4">
            complete
          </span>
        )}
        {status === "due_soon" && (
          <span className="text-xs text-slate-700 bg-yellow-400 rounded py-1 px-2 ml-4">
            due soon
          </span>
        )}
        {status === "overdue" && (
          <span className="text-xs text-white bg-red-600 rounded py-1 px-2 ml-4">
            overdue
          </span>
        )}
      </button>

      {/* Popup Parts */}
      <PopupDueDate
        id={id}
        usage="update"
        isOpen={isPopupDueDateOpen}
        onClickClose={() => setIsPopupDueDateOpen(false)}
      />
    </div>
  );
};

export default CardDueDate;
