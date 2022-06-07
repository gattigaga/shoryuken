import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

type Body = {
  title: string;
};

export const updateBoardById = async ({
  id,
  body,
}: {
  id: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/boards/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateBoardById, {
    onMutate: async (payload) => {
      const key = ["boards", payload.id];
      const listKey = "boards";

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(listKey);

      const previousBoard = queryClient.getQueryData(key);
      const previousBoards = queryClient.getQueryData(listKey);

      queryClient.setQueryData(key, (oldBoard) => ({
        ...oldBoard,
        title: payload.body.title,
      }));

      queryClient.setQueryData(listKey, (oldBoards) => {
        return oldBoards.map((board) => {
          if (board.id === payload.id) {
            return {
              ...board,
              title: payload.body.title,
            };
          }

          return board;
        });
      });

      return { previousBoard, previousBoards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(["boards", payload.id], context.previousBoard);
      queryClient.setQueryData("boards", context.previousBoards);
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["boards", payload.id]);
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useUpdateBoardMutation;
