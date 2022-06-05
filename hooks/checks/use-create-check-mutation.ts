import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";

type Response = any;

type Body = {
  content: string;
  card_id: number;
};

const createCheck = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/checks", body);
  const data = res.data.data;

  return data;
};

const useCreateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createCheck, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.card_id }];

      await queryClient.cancelQueries(key);

      const previousChecks = queryClient.getQueryData(key);

      const newCheck = {
        id: uuid(),
        index: previousChecks.length,
        ...payload,
      };

      queryClient.setQueryData(key, (oldChecks) => [...oldChecks, newCheck]);

      return { previousChecks };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["checks", { card_id: payload.card_id }],
        context.previousChecks
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["checks", { card_id: payload.card_id }]);
    },
  });
};

export default useCreateCheckMutation;
