import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

export const deleteListById = async ({
  id,
  boardId,
}: {
  id: string | number;
  boardId: string | number;
}): Promise<Response> => {
  const res = await axios.delete(`/api/lists/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteListById, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.boardId }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldLists) => {
        return oldLists.filter((list) => list.id !== payload.id);
      });

      return { previousLists };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["lists", { board_id: payload.boardId }],
        context.previousLists
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["lists", { board_id: payload.boardId }]);
    },
  });
};

export default useDeleteListMutation;
