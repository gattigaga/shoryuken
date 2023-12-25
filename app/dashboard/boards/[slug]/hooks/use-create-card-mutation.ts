import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { getSlug } from "../../../../../helpers/formatter";
import { Card } from "../../../../../types/models";

type Context = {
  previousCards?: Card[];
};

type Response = Card;

type Body = {
  title: string;
  list_id: number;
};

type Payload = {
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/cards", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["cards", { list_id: body.list_id }];

      await queryClient.cancelQueries("cards");

      const previousCards = queryClient.getQueryData<Card[]>(key);

      if (previousCards) {
        const newCard: Card = {
          id: Date.now(),
          index: previousCards.length,
          slug: getSlug(body.title),
          description: "",
          has_checklist: false,
          created_at: new Date().toISOString(),
          checks: [],
          due_dates: [],
          ...body,
        };

        const data = produce(previousCards, (draft) => {
          draft.push(newCard);
        });

        queryClient.setQueryData<Card[]>(key, data);
      }

      return { previousCards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousCards) {
        queryClient.setQueryData<Card[]>(
          ["cards", { list_id: payload.body.list_id }],
          context.previousCards
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries("cards");
    },
  });
};

export default useCreateCardMutation;
