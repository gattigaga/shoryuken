import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Card, Check } from "../../../../../types/models";

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

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/checks", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["checks", { card_id: body.card_id }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries("checks");
      await queryClient.cancelQueries("cards");

      const previousChecks = queryClient.getQueryData<Check[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousChecks) {
        const newCheck: Check = {
          id: Date.now(),
          index: previousChecks.length,
          is_checked: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        const data = produce(previousChecks, (draft) => {
          draft.push(newCheck);
        });

        queryClient.setQueryData<Check[]>(key, data);
      }

      if (previousCards && previousChecks) {
        const newCheck: Check = {
          id: Date.now(),
          index: previousChecks.length,
          is_checked: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        const data = produce(previousCards, (draft) => {
          const index = draft.findIndex((item) => item.id === body.card_id);

          if (index !== -1) {
            draft[index].checks.push(newCheck);
          }
        });

        queryClient.setQueryData<Card[]>(cardsKey, data);
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
      queryClient.invalidateQueries("checks");
      queryClient.invalidateQueries("cards");
    },
  });
};

export default useCreateCheckMutation;
