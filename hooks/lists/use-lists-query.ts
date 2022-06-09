import axios from "axios";
import { useQuery } from "react-query";

type List = {
  id: number;
  board_id: number;
  index: number;
  title: string;
  created_at: string;
};

type Response = List[];

export const getListsByBoardId = async (boardId: number): Promise<Response> => {
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
    getListsByBoardId(boardId)
  );
};

export default useListsQuery;
