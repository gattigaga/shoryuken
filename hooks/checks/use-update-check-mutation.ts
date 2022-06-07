import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Response = any;

type Body = {
  content?: string;
  index?: number;
  is_checked?: boolean;
};

export const updateCheckById = async ({
  id,
  listId,
  cardId,
  body,
}: {
  id: number;
  listId: number;
  cardId: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/checks/${id}`, body);
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

      const previousChecks = queryClient.getQueryData(key);
      const previousCards = queryClient.getQueryData(cardsKey);

      queryClient.setQueryData(key, (oldChecks) => {
        let newChecks = oldChecks;

        // Update index across all lists in a board.
        if (payload.body.index !== undefined) {
          const check = oldChecks.find((check) => check.id === payload.id);
          const fromIndex = check.index;
          const toIndex = payload.body.index;

          newChecks = moveElement(oldChecks, fromIndex, toIndex).map(
            (check, index) => ({
              ...check,
              index,
            })
          );
        }

        return newChecks.map((check) => {
          if (check.id === payload.id) {
            return {
              ...check,
              content: payload.body.content || check.content,
              is_checked: payload.body.is_checked || check.is_checked,
            };
          }

          return check;
        });
      });

      queryClient.setQueryData(cardsKey, (oldCards) => {
        return oldCards.map((card) => {
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
      });

      return { previousChecks, previousCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["checks", { card_id: payload.cardId }],
        context.previousChecks
      );

      queryClient.setQueryData(
        ["cards", { list_id: payload.listId }],
        context.previousCards
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["checks", { card_id: payload.cardId }]);
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useUpdateCheckMutation;
