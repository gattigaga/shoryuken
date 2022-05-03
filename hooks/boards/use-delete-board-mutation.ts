import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

export const deleteBoardById = async (
  id: string | number
): Promise<Response> => {
  const res = await axios.delete(`/api/boards/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteBoardMutation = () => useMutation(deleteBoardById);

export default useDeleteBoardMutation;
