import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { moveElement } from "../../../../helpers/data-structures";
import { Card, Check } from "../../../../../types/models";

type Context = {
  previousChecks?: Check[];
  previousCards?: Card[];
};

type Response = Check;

type Body = {
  content?: string;
  index?: number;
  is_checked?: boolean;
};

type Payload = {
  id: number;
  listId: number;
  cardId: number;
  body: Body;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/checks/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.cardId }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries("checks");
      await queryClient.cancelQueries("cards");

      const previousChecks = queryClient.getQueryData<Check[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);
      const { body } = payload;

      if (previousChecks) {
        const data = produce(previousChecks, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.id);

          if (index !== -1) {
            // Move a check in the card.
            if (body.index !== undefined) {
              const fromIndex = index;
              const toIndex = body.index;

              if (toIndex !== undefined) {
                return moveElement(draft, fromIndex, toIndex).map(
                  (check, index) => ({
                    ...check,
                    index,
                  })
                );
              }
            }

            if (body.content) {
              draft[index].content = body.content;
            }

            if (body.is_checked !== undefined) {
              draft[index].is_checked = body.is_checked;
            }
          }
        });

        queryClient.setQueryData<Check[]>(key, data);
      }

      if (previousCards) {
        const data = produce(previousCards, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.cardId);

          if (index !== -1) {
            const checkIndex = draft[index].checks.findIndex(
              (item) => item.id === payload.id
            );

            if (checkIndex !== -1 && body.is_checked !== undefined) {
              draft[index].checks[checkIndex].is_checked = body.is_checked;
            }
          }
        });

        queryClient.setQueryData<Card[]>(cardsKey, data);
      }

      return { previousChecks, previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousChecks) {
        queryClient.setQueryData(
          ["checks", { card_id: payload.cardId }],
          context.previousChecks
        );
      }

      if (context?.previousCards) {
        queryClient.setQueryData(
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

export default useUpdateCheckMutation;
