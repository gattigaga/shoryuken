import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Board } from "../../../../types/models";

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

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/boards/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = ["boards", payload.id];
      const listKey = "boards";

      await queryClient.cancelQueries("boards");

      const previousBoard = queryClient.getQueryData<Board>(key);
      const previousBoards = queryClient.getQueryData<Board[]>(listKey);
      const { body } = payload;

      if (previousBoard) {
        const data = produce(previousBoard, (draft) => {
          draft.title = body.title;
        });

        queryClient.setQueryData<Board>(key, data);
      }

      if (previousBoards) {
        const data = produce(previousBoards, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.id);

          if (index !== -1) {
            draft[index].title = body.title;
          }
        });

        queryClient.setQueryData<Board[]>(listKey, data);
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
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useUpdateBoardMutation;
