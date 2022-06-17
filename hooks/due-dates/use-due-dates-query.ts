import axios from "axios";
import { useQuery } from "react-query";

type DueDate = {
  id: number;
  card_id: number;
  timestamp: string;
  is_done: boolean;
  created_at: string;
};

type Response = DueDate[];

export const getDueDatesByCardId = async (
  cardId: number
): Promise<Response> => {
  const res = await axios.get("/api/due-dates", {
    params: {
      card_id: cardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useDueDatesQuery = (cardId: number) => {
  return useQuery<DueDate[], Error>(
    ["due_dates", { card_id: cardId }],
    () => getDueDatesByCardId(cardId),
    {
      initialData: [],
    }
  );
};

export default useDueDatesQuery;
