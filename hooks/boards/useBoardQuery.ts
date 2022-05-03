import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

export const getBoardById = async (id: string | number): Promise<Response> => {
  const res = await axios.get(`/api/boards/${id}`);
  const data = res.data.data;

  return data;
};

const useBoardQuery = (id: string | number, initialData: any) => {
  return useQuery(["boards", id], () => getBoardById(id), {
    initialData,
  });
};

export default useBoardQuery;
