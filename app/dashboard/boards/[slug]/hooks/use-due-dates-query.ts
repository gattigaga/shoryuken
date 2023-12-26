import axios from "axios";
import { useQuery } from "react-query";

import { DueDate } from "../../../../types/models";

type Response = DueDate[];

export const action = async (cardId?: number): Promise<Response> => {
  const res = await axios.get("/api/due-dates", {
    params: {
      card_id: cardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useDueDatesQuery = (cardId?: number) => {
  return useQuery<DueDate[], Error>(
    ["due_dates", { card_id: cardId }],
    () => action(cardId),
    {
      enabled: !!cardId,
    }
  );
};

export default useDueDatesQuery;
