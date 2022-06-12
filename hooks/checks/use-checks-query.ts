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

type Response = Check[];

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
  return useQuery<Check[], Error>(
    ["checks", { card_id: cardId }],
    () => getChecksByCardId(cardId),
    {
      initialData: [],
    }
  );
};

export default useChecksQuery;
