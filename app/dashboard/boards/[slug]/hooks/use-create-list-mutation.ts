import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { List } from "../../../../../types/models";

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

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/lists", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["lists", { board_id: body.board_id }];

      await queryClient.cancelQueries("lists");

      const previousLists = queryClient.getQueryData<List[]>(key);

      if (previousLists) {
        const newList: List = {
          id: Date.now(),
          index: previousLists.length,
          created_at: new Date().toISOString(),
          ...body,
        };

        const data = produce(previousLists, (draft) => {
          draft.push(newList);
        });

        queryClient.setQueryData<List[]>(key, data);
      }

      return { previousLists };
    },
    onSuccess: (response) => {
      queryClient.setQueryData<List>(["lists", response.id], response);
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
      queryClient.invalidateQueries("lists");
    },
  });
};

export default useCreateListMutation;
