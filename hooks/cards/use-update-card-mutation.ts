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
      const { id, listId, body } = payload;

      const fromList = listId;
      const toList = body.list_id;
      const toIndex = body.index;
      const key = ["cards", id];
      const fromKey = ["cards", { list_id: fromList }];
      const toKey = toList && ["cards", { list_id: toList }];

      await queryClient.cancelQueries(fromKey);
      const previousCard = queryClient.getQueryData(key);
      const previousFromCards = queryClient.getQueryData(fromKey);
      const previousToCards = toKey && queryClient.getQueryData(toKey);

      let newFromCards = previousFromCards;
      let newToCards;

      // Move card in a list.
      if (toIndex !== undefined && !toList) {
        const card = newFromCards.find((card) => card.id === id);
        const fromIndex = card.index;
        const toIndex = body.index;

        newFromCards = moveElement(newFromCards, fromIndex, toIndex).map(
          (card, index) => ({
            ...card,
            index,
          })
        );
      }

      // Move card in across 2 lists.
      if (toList) {
        const card = newFromCards.find((card) => card.id === id);

        newFromCards = newFromCards
          .filter((fromCard) => {
            return fromCard.id !== card.id;
          })
          .map((fromCard, index) => ({ ...fromCard, index }));

        newToCards = [
          ...previousToCards.slice(0, body.index),
          card,
          ...previousToCards.slice(body.index),
        ].map((toCard, index) => ({ ...toCard, index }));
      }

      newFromCards = newFromCards.map((card) => {
        if (card.id === id) {
          const title = body.title !== undefined ? body.title : card.title;

          const description =
            body.description !== undefined
              ? body.description
              : card.description;

          return {
            ...card,
            title,
            description,
          };
        }

        return card;
      });

      const newCard = (() => {
        const title =
          body.title !== undefined ? body.title : previousCard.title;

        const description =
          body.description !== undefined
            ? body.description
            : previousCard.description;

        return {
          ...previousCard,
          title,
          description,
        };
      })();

      queryClient.setQueryData(key, newCard);
      queryClient.setQueryData(fromKey, newFromCards);

      if (toKey) {
        queryClient.setQueryData(toKey, newToCards);
      }

      return {
        previousCard,
        previousFromCards,
        previousToCards,
      };
    },
    onError: (error, payload, context) => {
      const { id, listId, body } = payload;

      queryClient.setQueryData(["cards", id], context.previousCard);

      queryClient.setQueryData(
        ["cards", { list_id: listId }],
        context.previousFromCards
      );

      if (body.list_id) {
        queryClient.setQueryData(
          ["cards", { list_id: body.list_id }],
          context.previousToCards
        );
      }
    },
    onSettled: (data, error, payload) => {
      const { id, listId, body } = payload;

      queryClient.invalidateQueries(["cards", id]);
      queryClient.invalidateQueries(["cards", { list_id: listId }]);

      if (body.list_id) {
        queryClient.invalidateQueries(["cards", { list_id: body.list_id }]);
      }
    },
  });
};

export default useUpdateCardMutation;
