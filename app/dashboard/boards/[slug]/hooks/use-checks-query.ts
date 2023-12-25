import axios from "axios";
import { useQuery } from "react-query";

import { Check } from "../../../../../types/models";

type Response = Check[];

export const action = async (cardId: number): Promise<Response> => {
  const res = await axios.get("/api/checks", {
    params: {
      card_id: cardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useChecksQuery = (cardId: number) => {
  return useQuery<Check[], Error>(
    ["checks", { card_id: cardId }],
    () => action(cardId),
    {
      initialData: [],
    }
  );
};

export default useChecksQuery;
