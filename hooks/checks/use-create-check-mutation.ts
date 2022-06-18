import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Card, Check } from "../../types/models";

type Context = {
  previousChecks?: Check[];
  previousCards?: Card[];
};

type Response = Check;

type Body = {
  content: string;
  card_id: number;
};

type Payload = {
  listId: number;
  body: Body;
};

const createCheck = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/checks", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createCheck, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["checks", { card_id: body.card_id }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousChecks = queryClient.getQueryData<Check[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousChecks) {
        const newCheck = {
          id: Date.now(),
          index: previousChecks.length,
          is_checked: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        queryClient.setQueryData<Check[]>(key, [...previousChecks, newCheck]);
      }

      if (previousCards) {
        const newCards = previousCards.map((card) => {
          if (card.id === body.card_id) {
            const checks = [
              ...(card.checks || []),
              {
                id: Date.now(),
                card_id: card.id,
                content: body.content,
                index: card.checks?.length || 0,
                is_checked: false,
                created_at: new Date().toISOString(),
              },
            ];

            return {
              ...card,
              checks,
            };
          }

          return card;
        });

        queryClient.setQueryData<Card[]>(cardsKey, newCards);
      }

      return { previousChecks, previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousChecks) {
        queryClient.setQueryData<Check[]>(
          ["checks", { card_id: payload.body.card_id }],
          context.previousChecks
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
        "checks",
        { card_id: payload.body.card_id },
      ]);

      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useCreateCheckMutation;
