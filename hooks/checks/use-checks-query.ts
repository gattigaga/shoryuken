import axios from "axios";
import { useQuery } from "react-query";

type Response = any[];

export const getChecksByCardId = async (cardId: number): Promise<Response> => {
  const res = await axios.get("/api/checks", {
    params: {
      card_id: cardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useChecksQuery = (cardId: number) => {
  return useQuery(
    ["checks", { card_id: cardId }],
    () => getChecksByCardId(cardId),
    {
      initialData: [],
    }
  );
};

export default useChecksQuery;
