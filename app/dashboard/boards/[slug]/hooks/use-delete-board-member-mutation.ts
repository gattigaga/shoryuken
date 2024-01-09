import axios from "axios";
import { useMutation } from "react-query";

import { BoardMember } from "../../../../types/models";

type Response = BoardMember;

type Payload = {
  id: number;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/board-members/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteBoardMemberMutation = () => useMutation(action);

export default useDeleteBoardMemberMutation;
