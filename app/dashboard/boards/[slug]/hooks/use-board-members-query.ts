import axios from "axios";
import { useQuery } from "react-query";

import { BoardMember } from "../../../../types/models";

type Response = BoardMember[];

export const action = async (boardId: number): Promise<Response> => {
  const res = await axios.get("/api/board-members", {
    params: {
      board_id: boardId,
    },
  });

  const data = res.data.data;

  return data;
};

const useBoardMembersQuery = (boardId: number, initialData?: BoardMember[]) => {
  return useQuery<BoardMember[], Error>(
    ["board_members", { board_id: boardId }],
    () => action(boardId),
    {
      initialData,
    }
  );
};

export default useBoardMembersQuery;
