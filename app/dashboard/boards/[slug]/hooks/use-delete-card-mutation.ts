import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Card } from "../../../../types/models";

type Context = {
  previousCards?: Card[];
};

type Response = Card;

type Payload = {
  id: number;
  listId: number;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/cards/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries("cards");

      const previousCards = queryClient.getQueryData<Card[]>(key);

      if (previousCards) {
        const data = produce(previousCards, (draft) => {
          return draft
            .filter((card) => card.id !== payload.id)
            .map((card, index) => ({
              ...card,
              index,
            }));
        });

        queryClient.setQueryData<Card[]>(key, data);
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
      queryClient.invalidateQueries("cards");
    },
  });
};

export default useDeleteCardMutation;
