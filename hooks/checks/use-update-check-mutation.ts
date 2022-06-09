import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Check = {
  id: number;
  card_id: number;
  index: number;
  content: string;
  is_checked: boolean;
  created_at: string;
};

type Card = {
  id: number;
  list_id: number;
  index: number;
  title: string;
  description: string;
  slug: string;
  has_checklist: boolean;
  created_at: string;
  checks?: Check[];
};

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

export const updateCheckById = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/checks/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCheckById, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.cardId }];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(cardsKey);

      const previousChecks = queryClient.getQueryData<Check[]>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);
      const { body } = payload;

      if (previousChecks) {
        let newChecks = [...previousChecks];

        // Move a check in the card.
        if (body.index !== undefined) {
          const check = previousChecks.find((check) => check.id === payload.id);
          const fromIndex = check?.index;
          const toIndex = body.index;

          if (fromIndex && toIndex) {
            newChecks = moveElement(previousChecks, fromIndex, toIndex).map(
              (check, index) => ({
                ...check,
                index,
              })
            );
          }
        }

        newChecks = newChecks.map((check) => {
          if (check.id === payload.id) {
            return {
              ...check,
              content: body.content || check.content,
              is_checked: body.is_checked || check.is_checked,
            };
          }

          return check;
        });

        queryClient.setQueryData<Check[]>(key, newChecks);
      }

      if (previousCards) {
        const newCards = previousCards.map((card) => {
          if (card.id === payload.cardId) {
            const checks =
              card.checks?.map((check) => {
                if (check.id === payload.id) {
                  return {
                    ...check,
                    is_checked: !check.is_checked,
                  };
                }

                return check;
              }) || [];

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
      queryClient.invalidateQueries(["checks", { card_id: payload.cardId }]);
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useUpdateCheckMutation;
