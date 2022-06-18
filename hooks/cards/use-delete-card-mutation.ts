import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Card } from "../../types/models";

type Context = {
  previousCards?: Card[];
};

type Response = Card;

type Payload = {
  id: number;
  listId: number;
};

export const deleteCardById = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/cards/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCardById, {
    onMutate: async (payload) => {
      const key = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);

      const previousCards = queryClient.getQueryData<Card[]>(key);

      if (previousCards) {
        const newCards = previousCards
          .filter((card) => card.id !== payload.id)
          .map((card, index) => ({
            ...card,
            index,
          }));

        queryClient.setQueryData<Card[]>(key, newCards);
      }

      return { previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousCards) {
        queryClient.setQueryData<Card[]>(
          ["cards", { list_id: payload.listId }],
          context.previousCards
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useDeleteCardMutation;
