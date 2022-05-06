import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

export const getListById = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/lists/${id}`);
  const data = res.data.data;

  return data;
};

const useListQuery = (id: number) => {
  return useQuery(["lists", id], () => getListById(id), {
    enabled: !!id,
  });
};

export default useListQuery;
