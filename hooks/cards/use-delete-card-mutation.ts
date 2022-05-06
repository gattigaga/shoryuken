import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

export const deleteCardById = async ({
  id,
  listId,
}: {
  id: number;
  listId: number;
}): Promise<Response> => {
  const res = await axios.delete(`/api/cards/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCardById, {
    onMutate: async (payload) => {
      const key = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);

      const previousCards = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldCards) => {
        return oldCards
          .filter((card) => card.id !== payload.id)
          .map((card, index) => ({
            ...card,
            index,
          }));
      });

      return { previousCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["cards", { list_id: payload.listId }],
        context.previousCards
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useDeleteCardMutation;
