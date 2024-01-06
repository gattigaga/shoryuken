"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { format, formatISO, isValid, parse, parseISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import toast from "react-hot-toast";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Popup from "./Popup";
import useCreateDueDateMutation from "../hooks/use-create-due-date-mutation";
import useDeleteDueDateMutation from "../hooks/use-delete-due-date-mutation";
import useUpdateDueDateMutation from "../hooks/use-update-due-date-mutation";
import useCardQuery from "../hooks/use-card-query";

type Props = {
  id: number;
  usage: "add" | "update";
  isOpen?: boolean;
  onClickClose?: () => void;
};

const PopupDueDate: React.FC<Props> = ({ id, usage, isOpen, onClickClose }) => {
  const timePattern = "KK:mm aa";

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), timePattern));
  const cardQuery = useCardQuery(id);
  const createDueDateMutation = useCreateDueDateMutation();
  const updateDueDateMutation = useUpdateDueDateMutation();
  const deleteDueDateMutation = useDeleteDueDateMutation();
  const refButton = useRef<HTMLButtonElement>(null);
  const { _ } = useLingui();

  const dueDate = cardQuery.data?.due_dates[0];

  const applyTime = (event: any) => {
    const parsed = parse(event.target.value, timePattern, new Date());

    if (!isValid(parsed)) {
      setTime(format(new Date(), timePattern));
    }
  };

  const save = async () => {
    if (!cardQuery.data) return;

    onClickClose?.();

    try {
      const timestamp = (() => {
        const dateString = format(date, "yyyy-MM-dd");
        const timeString = format(parse(time, "KK:mm aa", new Date()), "HH:mm");

        const utcDate = zonedTimeToUtc(
          `${dateString} ${timeString}`,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        return formatISO(utcDate);
      })();

      if (usage === "add") {
        await createDueDateMutation.mutateAsync({
          listId: cardQuery.data.list_id,
          body: {
            timestamp,
            card_id: id,
          },
        });
      }

      if (usage === "update" && !!dueDate) {
        await updateDueDateMutation.mutateAsync({
          id: dueDate.id,
          listId: cardQuery.data.list_id,
          cardId: id,
          body: {
            timestamp,
          },
        });
      }
    } catch (error) {
      const message =
        usage === "add"
          ? _(msg`Failed to add due date.`)
          : _(msg`Failed to update due date.`);

      toast.error(message);
    }
  };

  const remove = async () => {
    if (!dueDate || !cardQuery.data) return;

    onClickClose?.();

    try {
      await deleteDueDateMutation.mutateAsync({
        id: dueDate.id,
        listId: cardQuery.data.list_id,
        cardId: id,
      });
    } catch (error) {
      toast.error(_(msg`Failed to remove due date.`));
    }
  };

  // Initialize date and time.
  useEffect(() => {
    if (isOpen) {
      if (usage === "add") {
        setDate(new Date());
        setTime(format(new Date(), timePattern));
      }

      if (usage === "update" && !!dueDate) {
        const parsedDate = parseISO(dueDate.timestamp);

        setDate(parsedDate);
        setTime(format(parsedDate, timePattern));
      }
    }
  }, [isOpen]);

  return (
    <Popup title={_(msg`Due Date`)} isOpen={isOpen} onClickClose={onClickClose}>
      <Calendar onChange={setDate} value={date} />
      <Input
        className="w-full mt-4 text-center"
        placeholder={_(msg`Time`)}
        value={time}
        onChange={(event) => setTime(event.target.value)}
        onKeyDown={(event) => {
          if (["Enter", "Escape"].includes(event.key)) {
            event.stopPropagation();
            applyTime(event);
            refButton.current?.focus();
          }
        }}
        onBlur={applyTime}
      />
      <Button
        ref={refButton}
        className="w-full mt-4"
        type="button"
        onClick={save}
      >
        <Trans>Save</Trans>
      </Button>
      {usage === "update" && (
        <Button
          className="w-full mt-1"
          backgroundColor={["bg-white", "bg-slate-100"]}
          textColor="text-slate-700"
          type="button"
          onClick={remove}
        >
          <Trans>Remove</Trans>
        </Button>
      )}
    </Popup>
  );
};

export default PopupDueDate;
