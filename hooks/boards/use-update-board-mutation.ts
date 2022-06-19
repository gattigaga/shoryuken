import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Board } from "../../types/models";

type Context = {
  previousBoard?: Board;
  previousBoards?: Board[];
};

type Response = Board;

type Body = {
  title: string;
};

type Payload = {
  id: number;
  body: Body;
};

export const updateBoardById = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/boards/${payload.id}`, payload.body);
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

      const previousBoard = queryClient.getQueryData<Board>(key);
      const previousBoards = queryClient.getQueryData<Board[]>(listKey);
      const { body } = payload;

      if (previousBoard) {
        const newBoard: Board = {
          ...previousBoard,
          title: body.title,
        };

        queryClient.setQueryData<Board>(key, newBoard);
      }

      if (previousBoards) {
        const newBoards = previousBoards.map((board) => {
          if (board.id === payload.id) {
            return {
              ...board,
              title: body.title,
            };
          }

          return board;
        });

        queryClient.setQueryData<Board[]>(listKey, newBoards);
      }

      return { previousBoard, previousBoards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData<Board>(
          ["boards", payload.id],
          context.previousBoard
        );
      }

      if (context?.previousBoards) {
        queryClient.setQueryData<Board[]>("boards", context.previousBoards);
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["boards", payload.id]);
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useUpdateBoardMutation;
