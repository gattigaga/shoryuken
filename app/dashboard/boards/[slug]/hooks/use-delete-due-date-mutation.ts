import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Card, DueDate } from "../../../../../types/models";

type Context = {
  previousCard?: Card;
  previousCards?: Card[];
};

type Response = DueDate;

type Payload = {
  id: number;
  listId: number;
  cardId: number;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/due-dates/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = ["cards", payload.cardId];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries("cards");

      const previousCard = queryClient.getQueryData<Card>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousCard) {
        const data = produce(previousCard, (draft) => {
          draft.due_dates = [];
        });

        queryClient.setQueryData<Card>(key, data);
      }

      if (previousCards) {
        const data = produce(previousCards, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.cardId);

          if (index !== -1) {
            draft[index].due_dates = [];
          }
        });

        queryClient.setQueryData<Card[]>(cardsKey, data);
      }

      return { previousCard, previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousCard) {
        queryClient.setQueryData<Card>(
          ["cards", payload.cardId],
          context.previousCard
        );
      }

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

export default useDeleteDueDateMutation;
