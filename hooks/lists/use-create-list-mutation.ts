import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";

type Response = any;

type Body = {
  title: string;
  board_id: number;
};

const createList = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/lists", body);
  const data = res.data.data;

  return data;
};

const useCreateListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createList, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.board_id }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData(key);

      const newList = {
        id: uuid(),
        index: previousLists.length,
        ...payload,
      };

      queryClient.setQueryData(key, (oldLists) => [...oldLists, newList]);

      return { previousLists };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["lists", { board_id: payload.board_id }],
        context.previousLists
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["lists", { board_id: payload.board_id }]);
    },
  });
};

export default useCreateListMutation;
