import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Card, DueDate } from "../../types/models";

type Context = {
  previousDueDates?: DueDate[];
  previousCards?: Card[];
};

type Response = DueDate;

type Payload = {
  id: number;
  listId: number;
  cardId: number;
};

export const deleteDueDateById = async (
  payload: Payload
): Promise<Response> => {
  const res = await axios.delete(`/api/due-dates/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteDueDateById, {
    onMutate: async (payload) => {
      const key = ["due_dates", { card_id: payload.cardId }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousDueDates) {
        const newDueDates = previousDueDates.filter(
          (dueDate) => dueDate.id !== payload.id
        );

        queryClient.setQueryData<DueDate[]>(key, newDueDates);
      }

      if (previousCards) {
        const newCards = previousCards.filter(
          (card) => card.id !== payload.cardId
        );

        queryClient.setQueryData<Card[]>(cardsKey, newCards);
      }

      return { previousDueDates, previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousDueDates) {
        queryClient.setQueryData(
          ["due_dates", { card_id: payload.cardId }],
          context.previousDueDates
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
      queryClient.invalidateQueries(["due_dates", { card_id: payload.cardId }]);
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useDeleteDueDateMutation;
