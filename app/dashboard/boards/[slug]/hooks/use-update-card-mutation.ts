import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { moveElement } from "../../../../helpers/data-structures";
import { Card } from "../../../../../types/models";

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

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/cards/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const { id, listId, body } = payload;

      const fromList = listId;
      const toList = body.list_id;
      const toIndex = body.index;
      const key = ["cards", id];
      const fromKey = ["cards", { list_id: fromList }];
      const toKey = toList ? ["cards", { list_id: toList }] : undefined;

      await queryClient.cancelQueries("cards");

      const previousCard = queryClient.getQueryData<Card>(key);
      const previousFromCards = queryClient.getQueryData<Card[]>(fromKey);
      const previousToCards = toKey && queryClient.getQueryData<Card[]>(toKey);

      if (previousCard) {
        const data = produce(previousCard, (draft) => {
          const hasChecklist = draft.has_checklist;

          Object.assign(draft, body);

          draft.has_checklist = hasChecklist;
        });

        queryClient.setQueryData<Card>(key, data);
      }

      if (previousFromCards) {
        const fromCardsData = produce(previousFromCards, (draft) => {
          const index = draft.findIndex((item) => item.id === id);

          if (index !== -1) {
            // Move card in a list.
            if (toIndex !== undefined && !toList) {
              const fromIndex = index;
              const toIndex = body.index;

              if (toIndex !== undefined) {
                return moveElement(draft, fromIndex, toIndex).map(
                  (card, index) => ({
                    ...card,
                    index,
                  })
                );
              }
            }

            // Move card in across 2 lists.
            if (toList) {
              return draft
                .filter((fromCard) => fromCard.id !== id)
                .map((fromCard, index) => ({ ...fromCard, index }));
            }

            if (body.title) {
              draft[index].title = body.title;
            }

            if (body.description !== undefined) {
              draft[index].description = body.description;
            }
          }
        });

        queryClient.setQueryData<Card[]>(fromKey, fromCardsData);
      }

      if (previousFromCards && previousToCards) {
        const toCardsData = produce(previousToCards, (draft) => {
          // Move card in across 2 lists.
          if (toList) {
            const card = previousFromCards.find((card) => card.id === id);

            if (card) {
              return [
                ...draft.slice(0, body.index),
                card,
                ...draft.slice(body.index),
              ].map((toCard, index) => ({ ...toCard, index }));
            }
          }
        });

        if (toKey) {
          queryClient.setQueryData<Card[]>(toKey, toCardsData);
        }
      }

      return {
        previousCard,
        previousFromCards,
        previousToCards,
      };
    },
    onSuccess: (response, payload) => {
      const key = ["cards", payload.id];
      const fromKey = ["cards", { list_id: payload.listId }];
      const previousCard = queryClient.getQueryData<Card>(key);
      const previousFromCards = queryClient.getQueryData<Card[]>(fromKey);

      if (previousCard) {
        const data = produce(previousCard, () => response);

        queryClient.setQueryData<Card>(key, data);
      }

      if (previousFromCards) {
        const data = produce(previousFromCards, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.id);

          if (index !== -1) {
            draft[index] = response;
          }
        });

        queryClient.setQueryData<Card[]>(fromKey, data);
      }
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
      queryClient.invalidateQueries("cards");
    },
  });
};

export default useUpdateCardMutation;
