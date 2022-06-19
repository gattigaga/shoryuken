import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { List } from "../../types/models";

type Context = {
  previousLists?: List[];
};

type Response = List;

type Payload = {
  id: number;
  boardId: number;
};

export const deleteListById = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/lists/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteListById, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.boardId }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData<List[]>(key);

      if (previousLists) {
        const newLists = previousLists
          .filter((list) => list.id !== payload.id)
          .map((list, index) => ({
            ...list,
            index,
          }));

        queryClient.setQueryData<List[]>(key, newLists);
      }

      return { previousLists };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousLists) {
        queryClient.setQueryData<List[]>(
          ["lists", { board_id: payload.boardId }],
          context.previousLists
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["lists", { board_id: payload.boardId }]);
    },
  });
};

export default useDeleteListMutation;
