import React from "react";
import {
  isAfter,
  isToday,
  isTomorrow,
  parseISO,
  format,
  isYesterday,
} from "date-fns";
import toast from "react-hot-toast";

import useDueDatesQuery from "../hooks/due-dates/use-due-dates-query";
import useUpdateDueDateMutation from "../hooks/due-dates/use-update-due-date-mutation";

type Props = {
  id: number;
};

const CardDueDate: React.FC<Props> = ({ id }) => {
  const dueDatesQuery = useDueDatesQuery(id);
  const updateDueDateMutation = useUpdateDueDateMutation();
  const dueDate = dueDatesQuery.data?.[0];

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
    if (!dueDate) return;

    try {
      await updateDueDateMutation.mutateAsync({
        id: dueDate.id,
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
    <div className="flex items-center mb-8 ml-9">
      <input
        className="rounded border-2 border-slate-300 w-5 h-5 mr-2"
        type="checkbox"
        checked={!!dueDate?.is_done}
        onChange={(event) => toggleDoneStatus(event.target.checked)}
      />
      <div className="flex items-center bg-slate-200 rounded px-3 py-2">
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
      </div>
    </div>
  );
};

export default CardDueDate;
