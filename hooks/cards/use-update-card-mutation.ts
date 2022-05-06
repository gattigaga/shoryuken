import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Response = any;

type Body = {
  title?: string;
  description?: string;
  index?: number;
  list_id?: number;
};

export const updateCardById = async ({
  id,
  listId,
  body,
}: {
  id: number;
  listId: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/cards/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCardById, {
    onMutate: async (payload) => {
      const fromList = payload.listId;
      const toList = payload.body.list_id;
      const toIndex = payload.body.index;
      const fromKey = ["cards", { list_id: fromList }];
      const toKey = toList && ["cards", { list_id: toList }];

      await queryClient.cancelQueries(fromKey);
      const previousFromCards = queryClient.getQueryData(fromKey);
      const previousToCards = toKey && queryClient.getQueryData(toKey);

      let newFromCards;
      let newToCards;

      // Move card in a list.
      if (toIndex !== undefined && !toList) {
        const card = previousFromCards.find((card) => card.id === payload.id);
        const fromIndex = card.index;
        const toIndex = payload.body.index;

        newFromCards = moveElement(previousFromCards, fromIndex, toIndex).map(
          (card, index) => ({
            ...card,
            index,
          })
        );
      }

      // Move card in across 2 lists.
      if (toList) {
        const card = previousFromCards.find((card) => card.id === payload.id);

        newFromCards = previousFromCards
          .filter((fromCard) => {
            return fromCard.id !== card.id;
          })
          .map((fromCard, index) => ({ ...fromCard, index }));

        newToCards = [
          ...previousToCards.slice(0, payload.body.index),
          card,
          ...previousToCards.slice(payload.body.index),
        ].map((toCard, index) => ({ ...toCard, index }));
      }

      newFromCards = newFromCards.map((card) => {
        if (card.id === payload.id) {
          return {
            ...card,
            title: payload.body.title || card.title,
            description: payload.body.description || card.description,
          };
        }

        return card;
      });

      queryClient.setQueryData(fromKey, newFromCards);

      if (toKey) {
        queryClient.setQueryData(toKey, newToCards);
      }

      return { previousFromCards, previousToCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["cards", { list_id: payload.listId }],
        context.previousFromCards
      );

      if (payload.body.list_id) {
        queryClient.setQueryData(
          ["cards", { list_id: payload.body.list_id }],
          context.previousToCards
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["cards", { list_id: payload.listId }]);

      if (payload.body.list_id) {
        queryClient.invalidateQueries([
          "cards",
          { list_id: payload.body.list_id },
        ]);
      }
    },
  });
};

export default useUpdateCardMutation;
