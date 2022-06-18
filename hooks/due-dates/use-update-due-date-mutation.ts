import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Card, DueDate } from "../../types/models";

type Context = {
  previousDueDates?: DueDate[];
  previousCards?: Card[];
};

type Response = DueDate;

type Body = {
  timestamp?: string;
  is_done?: boolean;
};

type Payload = {
  id: number;
  listId: number;
  cardId: number;
  body: Body;
};

export const updateDueDateById = async (
  payload: Payload
): Promise<Response> => {
  const res = await axios.put(`/api/due-dates/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateDueDateById, {
    onMutate: async (payload) => {
      const key = ["due_dates", { card_id: payload.cardId }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);
      const { body } = payload;

      if (previousDueDates) {
        const newDueDates = previousDueDates.map((dueDate) => {
          if (dueDate.id === payload.id) {
            return {
              ...dueDate,
              ...body,
            };
          }

          return dueDate;
        });

        queryClient.setQueryData<DueDate[]>(key, newDueDates);
      }

      if (previousCards) {
        const newCards = previousCards.map((card) => {
          if (card.id === payload.cardId) {
            const dueDates =
              card.due_dates?.map((dueDate) => {
                if (dueDate.id === payload.id) {
                  return {
                    ...dueDate,
                    ...body,
                  };
                }

                return dueDate;
              }) || [];

            return {
              ...card,
              due_dates: dueDates,
            };
          }

          return card;
        });

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

export default useUpdateDueDateMutation;
