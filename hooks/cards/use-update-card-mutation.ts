import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Response = any;

type Body = {
  title?: string;
  description?: string;
  index?: number;
};

export const updateCardById = async ({
  id,
  listId,
  body,
}: {
  id: string | number;
  listId: string | number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/cards/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateCardBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCardById, {
    onMutate: async (payload) => {
      const key = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries(key);

      const previousCards = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldCards) => {
        let newCards = oldCards;

        // Update index across all lists in a board.
        if (payload.body.index !== undefined) {
          const card = oldCards.find((card) => card.id === payload.id);
          const fromIndex = card.index;
          const toIndex = payload.body.index;

          newCards = moveElement(oldCards, fromIndex, toIndex).map(
            (card, index) => ({
              ...card,
              index,
            })
          );
        }

        return newCards.map((card) => {
          if (card.id === payload.id) {
            return {
              ...card,
              title: payload.body.title || card.title,
              description: payload.body.description || card.description,
            };
          }

          return card;
        });
      });

      return { previousCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["cards", { list_id: payload.listId }],
        context.previousCards
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);
    },
  });
};

export default useUpdateCardBoardMutation;
