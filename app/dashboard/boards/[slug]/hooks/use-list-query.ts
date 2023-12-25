import axios from "axios";
import { useQuery } from "react-query";

import { List } from "../../../../../types/models";

type Response = List;

export const action = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/lists/${id}`);
  const data = res.data.data;

  return data;
};

const useListQuery = (id: number) => {
  return useQuery<List, Error>(["lists", id], () => action(id), {
    enabled: !!id,
  });
};

export default useListQuery;
