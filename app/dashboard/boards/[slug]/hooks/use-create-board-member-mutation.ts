import axios from "axios";
import { useMutation } from "react-query";

import { BoardMember } from "../../../../types/models";

type Response = BoardMember;

type Body = {
  board_id: number;
  email: string;
};

type Payload = {
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/board-members", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateBoardMemberMutation = () => useMutation(action);

export default useCreateBoardMemberMutation;
