import axios from "axios";
import { useQuery } from "react-query";

type DueDate = {
  id: number;
  card_id: number;
  timestamp: string;
  is_done: boolean;
  created_at: string;
};

type Check = {
  id: number;
  card_id: number;
  index: number;
  content: string;
  is_checked: boolean;
  created_at: string;
};

type Card = {
  id: number;
  list_id: number;
  index: number;
  title: string;
  description: string;
  slug: string;
  has_checklist: boolean;
  created_at: string;
  checks?: Check[];
  due_dates?: DueDate[];
};

type Response = Card[];

export const getCardsByListId = async (listId: number): Promise<Response> => {
  const res = await axios.get("/api/cards/", {
    params: {
      list_id: listId,
    },
  });

  const data = res.data.data;

  return data;
};

const useCardsQuery = (listId: number) => {
  return useQuery<Card[], Error>(
    ["cards", { list_id: listId }],
    () => getCardsByListId(listId),
    {
      initialData: [],
    }
  );
};

export default useCardsQuery;
