import axios from "axios";
import { useQuery } from "react-query";

type Response = any[];

export const getListsByBoardId = async (
  boardId: string | number
): Promise<Response> => {
  const res = await axios.get("/api/lists/", {
    params: {
      board_id: boardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useListsQuery = (boardId: string | number) => {
  return useQuery(
    ["lists", { board_id: boardId }],
    () => getListsByBoardId(boardId),
    {
      initialData: [],
    }
  );
};

export default useListsQuery;
