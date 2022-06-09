import axios from "axios";
import { useQuery } from "react-query";

type Board = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  created_at: string;
};

type Response = Board;

export const getBoardById = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/boards/${id}`);
  const data = res.data.data;

  return data;
};

const useBoardQuery = (id: number, initialData?: any) => {
  return useQuery<Board, Error>(["boards", id], () => getBoardById(id), {
    initialData,
  });
};

export default useBoardQuery;
