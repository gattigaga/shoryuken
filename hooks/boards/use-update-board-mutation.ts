import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  title: string;
};

export const updateBoardById = async ({
  id,
  body,
}: {
  id: string | number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/boards/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateBoardMutation = () => useMutation(updateBoardById);

export default useUpdateBoardMutation;
