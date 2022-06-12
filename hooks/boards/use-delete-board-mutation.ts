import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Board = {
  id: number;
  user_id: string;
  title: string;
  slug: string;
  created_at: string;
};

type Context = {
  previousBoards?: Board[];
};

type Response = Board;

type Payload = {
  id: number;
};

export const deleteBoardById = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/boards/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteBoardById, {
    onMutate: async (payload) => {
      const key = "boards";

      await queryClient.cancelQueries(key);

      const previousBoards = queryClient.getQueryData<Board[]>(key);

      if (previousBoards) {
        const newBoards = previousBoards.filter(
          (board) => board.id !== payload.id
        );

        queryClient.setQueryData<Board[]>(key, newBoards);
      }

      return { previousBoards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData<Board[]>("boards", context.previousBoards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useDeleteBoardMutation;
