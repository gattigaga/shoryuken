import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { getSlug } from "../../helpers/formatter";

type DueDate = {
  id: number;
  card_id: number;
  timestamp: string;
  is_done: boolean;
  created_at: string;
};

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
  due_dates?: DueDate[];
};

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

const createCard = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/cards", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createCard, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["cards", { list_id: body.list_id }];

      await queryClient.cancelQueries(key);

      const previousCards = queryClient.getQueryData<Card[]>(key);

      if (previousCards) {
        const newCard: Card = {
          id: Date.now(),
          index: previousCards.length,
          slug: getSlug(body.title),
          description: "",
          has_checklist: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        queryClient.setQueryData<Card[]>(key, [...previousCards, newCard]);
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
      queryClient.invalidateQueries([
        "cards",
        { list_id: payload.body.list_id },
      ]);
    },
  });
};

export default useCreateCardMutation;
