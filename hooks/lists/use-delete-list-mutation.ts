import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

export const deleteListById = async (
  id: string | number
): Promise<Response> => {
  const res = await axios.delete(`/api/lists/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteListMutation = () => useMutation(deleteListById);

export default useDeleteListMutation;
