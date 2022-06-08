import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

export const deleteBoardById = async (id: number): Promise<Response> => {
  const res = await axios.delete(`/api/boards/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteBoardById, {
    onMutate: async (payload) => {
      await queryClient.cancelQueries("boards");

      const previousBoards = queryClient.getQueryData("boards");

      queryClient.setQueryData("boards", (oldBoards) => {
        return oldBoards && oldBoards.filter((board) => board.id !== payload);
      });

      return { previousBoards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData("boards", context.previousBoards);
    },
    onSettled: () => {
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useDeleteBoardMutation;
