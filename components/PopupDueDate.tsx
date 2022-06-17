import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { format, formatISO, isValid, parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import toast from "react-hot-toast";

import Button from "./Button";
import Input from "./Input";
import Popup from "./Popup";
import useCreateDueDateMutation from "../hooks/due-dates/use-create-due-date-mutation";

type Props = {
  id: number;
  isOpen?: boolean;
  onClickClose?: () => void;
};

const PopupDueDate: React.FC<Props> = ({ id, isOpen, onClickClose }) => {
  const timePattern = "KK:mm aa";

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), timePattern));
  const createDueDateMutation = useCreateDueDateMutation();
  const refButton = useRef<HTMLButtonElement>(null);

  const validateTime = (event: any) => {
    const parsed = parse(event.target.value, timePattern, new Date());

    if (!isValid(parsed)) {
      setTime(format(new Date(), timePattern));
    }
  };

  const save = async () => {
    onClickClose?.();

    const timestamp = (() => {
      const dateString = format(date, "yyyy-MM-dd");
      const timeString = format(parse(time, "KK:mm aa", new Date()), "HH:mm");

      const utcDate = zonedTimeToUtc(
        `${dateString} ${timeString}`,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );

      return formatISO(utcDate);
    })();

    try {
      await createDueDateMutation.mutateAsync({
        body: {
          timestamp,
          card_id: id,
        },
      });
    } catch (error) {
      toast.error("Failed to add due date.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setDate(new Date());
      setTime(format(new Date(), timePattern));
    }
  }, [isOpen]);

  return (
    <Popup title="Due Date" isOpen={isOpen} onClickClose={onClickClose}>
      <Calendar onChange={setDate} value={date} />
      <Input
        className="w-full mt-4 text-center"
        placeholder="Time"
        value={time}
        onChange={(event) => setTime(event.target.value)}
        onKeyDown={(event) => {
          if (["Enter", "Escape"].includes(event.key)) {
            event.stopPropagation();
            validateTime(event);
            refButton.current?.focus();
          }
        }}
        onBlur={validateTime}
      />
      <Button
        ref={refButton}
        className="w-full mt-4"
        type="button"
        onClick={save}
      >
        Save
      </Button>
    </Popup>
  );
};

export default PopupDueDate;
