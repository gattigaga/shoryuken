import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

export const getCardById = async (id: number): Promise<Response> => {
  const res = await axios.get(`/api/cards/${id}`);
  const data = res.data.data;

  return data;
};

const useBoardQuery = (id: number, initialData: any) => {
  return useQuery(["cards", id], () => getCardById(id), {
    initialData,
  });
};

export default useBoardQuery;
