import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { Card, DueDate } from "../../../../../types/models";

type Response = DueDate;

type Body = {
  timestamp: string;
  card_id: number;
};

type Payload = {
  listId: number;
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/due-dates", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onSuccess: async (response, payload) => {
      const { body } = payload;
      const key = ["cards", body.card_id];
      const cardsKey = ["cards", { list_id: payload.listId }];

      await queryClient.cancelQueries("cards");

      const previousCard = queryClient.getQueryData<Card>(key);
      const previousCards = queryClient.getQueryData<Card[]>(cardsKey);

      if (previousCard) {
        const data = produce(previousCard, (draft) => {
          draft.due_dates = [response];
        });

        queryClient.setQueryData<Card>(key, data);
      }

      if (previousCards) {
        const data = produce(previousCards, (draft) => {
          const index = draft.findIndex((item) => item.id === body.card_id);

          draft[index].due_dates = [response];
        });

        queryClient.setQueryData<Card[]>(cardsKey, data);
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries("cards");
    },
  });
};

export default useCreateDueDateMutation;
