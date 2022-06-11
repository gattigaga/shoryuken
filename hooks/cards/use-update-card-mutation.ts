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
  previousCard?: Card;
  previousFromCards?: Card[];
  previousToCards?: Card[];
};

type Response = Card;

type Body = {
  title?: string;
  description?: string;
  index?: number;
  has_checklist?: boolean;
  list_id?: number;
};

type Payload = {
  id: number;
  listId: number;
  body: Body;
};

export const updateCardById = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/cards/${payload.id}`, payload.body);
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
      const toKey = toList ? ["cards", { list_id: toList }] : undefined;

      await queryClient.cancelQueries(key);
      await queryClient.cancelQueries(fromKey);

      if (toKey) {
        await queryClient.cancelQueries(toKey);
      }

      const previousCard = queryClient.getQueryData<Card>(key);
      const previousFromCards = queryClient.getQueryData<Card[]>(fromKey);
      const previousToCards = toKey && queryClient.getQueryData<Card[]>(toKey);

      if (previousCard) {
        const newCard: Card = (() => {
          const title =
            body.title !== undefined ? body.title : previousCard?.title;

          const description =
            body.description !== undefined
              ? body.description
              : previousCard?.description;

          const hasChecklist =
            body.has_checklist !== undefined
              ? body.has_checklist
              : previousCard?.has_checklist;

          return {
            ...previousCard,
            title,
            description,
            has_checklist: hasChecklist,
          };
        })();

        queryClient.setQueryData<Card>(key, newCard);
      }

      if (previousFromCards) {
        let newFromCards = [...previousFromCards];
        let newToCards: Card[] = [];

        // Move card in a list.
        if (toIndex !== undefined && !toList) {
          const card = newFromCards.find((card) => card.id === id);
          const fromIndex = card?.index;
          const toIndex = body.index;

          if (fromIndex && toIndex) {
            newFromCards = moveElement(newFromCards, fromIndex, toIndex).map(
              (card, index) => ({
                ...card,
                index,
              })
            );
          }
        }

        // Move card in across 2 lists.
        if (toList) {
          const card = newFromCards.find((card) => card.id === id);

          if (card && previousToCards) {
            newFromCards = newFromCards
              .filter((fromCard) => fromCard.id !== card.id)
              .map((fromCard, index) => ({ ...fromCard, index }));

            newToCards = [
              ...previousToCards.slice(0, body.index),
              card,
              ...previousToCards.slice(body.index),
            ].map((toCard, index) => ({ ...toCard, index }));
          }
        }

        newFromCards = newFromCards.map((card) => {
          if (card.id === id) {
            const title = body.title !== undefined ? body.title : card.title;

            const description =
              body.description !== undefined
                ? body.description
                : card.description;

            const hasChecklist =
              body.has_checklist !== undefined
                ? body.has_checklist
                : card.has_checklist;

            return {
              ...card,
              title,
              description,
              has_checklist: hasChecklist,
            };
          }

          return card;
        });

        queryClient.setQueryData<Card[]>(fromKey, newFromCards);

        if (toKey) {
          queryClient.setQueryData<Card[]>(toKey, newToCards);
        }
      }

      return {
        previousCard,
        previousFromCards,
        previousToCards,
      };
    },
    onError: (error, payload, context?: Context) => {
      const { id, listId, body } = payload;

      if (context?.previousCard) {
        queryClient.setQueryData<Card>(["cards", id], context.previousCard);
      }

      if (context?.previousFromCards) {
        queryClient.setQueryData<Card[]>(
          ["cards", { list_id: listId }],
          context.previousFromCards
        );
      }

      if (body.list_id && context?.previousToCards) {
        queryClient.setQueryData<Card[]>(
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
