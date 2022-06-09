import axios from "axios";
import { useQuery } from "react-query";

type List = {
  id: number;
  board_id: number;
  index: number;
  title: string;
  created_at: string;
};

type Response = List;

export const getListById = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/lists/${id}`);
  const data = res.data.data;

  return data;
};

const useListQuery = (id: number) => {
  return useQuery<List, Error>(["lists", id], () => getListById(id), {
    enabled: !!id,
  });
};

export default useListQuery;
