import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { List } from "../../types/models";

type Context = {
  previousLists?: List[];
};

type Response = List;

type Body = {
  title: string;
  board_id: number;
};

type Payload = {
  body: Body;
};

const createList = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/lists", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createList, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["lists", { board_id: body.board_id }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData<List[]>(key);

      if (previousLists) {
        const newList: List = {
          id: Date.now(),
          index: previousLists.length,
          created_at: new Date().toISOString(),
          ...body,
        };

        queryClient.setQueryData<List[]>(key, [...previousLists, newList]);
      }

      return { previousLists };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousLists) {
        queryClient.setQueryData<List[]>(
          ["lists", { board_id: payload.body.board_id }],
          context.previousLists
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries([
        "lists",
        { board_id: payload.body.board_id },
      ]);
    },
  });
};

export default useCreateListMutation;
