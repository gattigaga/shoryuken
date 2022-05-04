import axios from "axios";
import { useQuery } from "react-query";

type Response = any[];

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
  return useQuery(
    ["cards", { list_id: listId }],
    () => getCardsByListId(listId),
    {
      initialData: [],
    }
  );
};

export default useCardsQuery;
