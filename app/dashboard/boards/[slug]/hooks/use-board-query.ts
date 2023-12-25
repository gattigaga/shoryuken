import axios from "axios";
import { useQuery } from "react-query";

import { Board } from "../../../../../types/models";

type Response = Board;

export const action = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/boards/${id}`);
  const data = res.data.data;

  return data;
};

const useBoardQuery = (id: number, initialData?: any) => {
  return useQuery<Board, Error>(["boards", id], () => action(id), {
    initialData,
  });
};

export default useBoardQuery;
