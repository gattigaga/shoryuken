import axios from "axios";
import { useQuery } from "react-query";

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
};

type Response = Card;

export const getCardById = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/cards/${id}`);
  const data = res.data.data;

  return data;
};

const useCardQuery = (id: number) => {
  return useQuery<Card, Error>(["cards", id], () => getCardById(id), {
    enabled: !!id,
  });
};

export default useCardQuery;
