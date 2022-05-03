import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  title: string;
  board_id: string | number;
};

const createList = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/lists", body);
  const data = res.data.data;

  return data;
};

const useCreateListMutation = () => useMutation(createList);

export default useCreateListMutation;
