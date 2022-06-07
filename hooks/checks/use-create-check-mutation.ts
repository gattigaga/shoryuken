import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";

type Response = any;

type Body = {
  content: string;
  card_id: number;
};

const createCheck = async ({
  listId,
  body,
}: {
  listId: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.post("/api/checks", body);
  const data = res.data.data;

  return data;
};

const useCreateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createCheck, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.body.card_id }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousChecks = queryClient.getQueryData(key);
      const previousCards = queryClient.getQueryData(cardsKey);

      const newCheck = {
        id: uuid(),
        index: previousChecks.length,
        ...payload.body,
      };

      queryClient.setQueryData(key, (oldChecks) => [...oldChecks, newCheck]);

      queryClient.setQueryData(cardsKey, (oldCards) => {
        return oldCards.map((card) => {
          if (card.id === payload.body.card_id) {
            const checks = [
              ...card.checks,
              {
                id: uuid(),
                card_id: card.id,
                content: payload.body.content,
                index: card.checks?.length || 0,
                is_checked: false,
              },
            ];

            return {
              ...card,
              checks,
            };
          }

          return card;
        });
      });

      return { previousChecks, previousCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["checks", { card_id: payload.body.card_id }],
        context.previousChecks
      );

      queryClient.setQueryData(
        ["cards", { list_id: payload.listId }],
        context.previousCards
      );
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
