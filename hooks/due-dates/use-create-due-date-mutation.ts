import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Card, DueDate } from "../../types/models";

type Context = {
  previousDueDates?: DueDate[];
  previousCards?: Card[];
};

type Response = DueDate;

type Body = {
  timestamp: string;
  card_id: number;
};

type Payload = {
  listId: number;
  body: Body;
};

const createDueDate = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/due-dates", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createDueDate, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["due_dates", { card_id: body.card_id }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousDueDates) {
        const newDueDate = {
          id: Date.now(),
          is_done: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        queryClient.setQueryData<DueDate[]>(key, [
          ...previousDueDates,
          newDueDate,
        ]);
      }

      if (previousCards) {
        const newCards = previousCards.map((card) => {
          if (card.id === body.card_id) {
            const dueDates = [
              ...(card.due_dates || []),
              {
                id: Date.now(),
                card_id: card.id,
                timestamp: body.timestamp,
                is_done: false,
                created_at: new Date().toISOString(),
              },
            ];

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
        queryClient.setQueryData<DueDate[]>(
          ["due_dates", { card_id: payload.body.card_id }],
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
      queryClient.invalidateQueries([
        "due_dates",
        { card_id: payload.body.card_id },
      ]);

      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useCreateDueDateMutation;
