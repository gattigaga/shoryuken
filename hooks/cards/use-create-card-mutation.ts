import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";

import { getSlug } from "../../helpers/formatter";

type Response = any;

type Body = {
  title: string;
  list_id: string | number;
};

const createCard = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/cards", body);
  const data = res.data.data;

  return data;
};

const useCreateCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createCard, {
    onMutate: async (payload) => {
      const key = ["cards", { list_id: payload.list_id }];

      await queryClient.cancelQueries(key);

      const previousCards = queryClient.getQueryData(key);

      const newCard = {
        id: uuid(),
        index: previousCards.length,
        slug: getSlug(payload.title),
        ...payload,
      };

      queryClient.setQueryData(key, (oldCards) => [...oldCards, newCard]);

      return { previousCards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["cards", { list_id: payload.list_id }],
        context.previousCards
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["cards", { list_id: payload.list_id }]);
    },
  });
};

export default useCreateCardMutation;
