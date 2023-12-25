import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Board } from "../../../../types/models";

type Context = {
  previousBoards?: Board[];
};

type Response = Board;

type Payload = {
  id: number;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/boards/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = "boards";

      await queryClient.cancelQueries(key);

      const previousBoards = queryClient.getQueryData<Board[]>(key);

      if (previousBoards) {
        const data = produce(previousBoards, (draft) => {
          return draft.filter((item) => item.id !== payload.id);
        });

        queryClient.setQueryData<Board[]>(key, data);
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
