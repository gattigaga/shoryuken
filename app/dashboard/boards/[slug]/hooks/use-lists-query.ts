import axios from "axios";
import { useQuery } from "react-query";

import { List } from "../../../../types/models";

type Response = List[];

export const action = async (boardId: number): Promise<Response> => {
  const res = await axios.get("/api/lists/", {
    params: {
      board_id: boardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useListsQuery = (boardId: number) => {
  return useQuery<List[], Error>(["lists", { board_id: boardId }], () =>
    action(boardId)
  );
};

export default useListsQuery;
