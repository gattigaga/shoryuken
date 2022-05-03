import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  title?: string;
  index?: number;
};

export const updateListById = async ({
  id,
  body,
}: {
  id: string | number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/lists/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateListBoardMutation = () => useMutation(updateListById);

export default useUpdateListBoardMutation;
