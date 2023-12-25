import axios from "axios";
import { useQuery } from "react-query";

import { Card } from "../../../../types/models";

type Response = Card;

export const action = async (id?: number): Promise<Response> => {
  const res = await axios.get(`/api/cards/${id}`);
  const data = res.data.data;

  return data;
};

const useCardQuery = (id?: number) => {
  return useQuery<Card, Error>(["cards", id], () => action(id), {
    enabled: !!id,
  });
};

export default useCardQuery;
