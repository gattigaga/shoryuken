import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  title: string;
};

const createBoard = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/boards", body);
  const data = res.data.data;

  return data;
};

const useCreateBoardMutation = () => useMutation(createBoard);

export default useCreateBoardMutation;
