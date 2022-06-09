import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Check = {
  id: number;
  card_id: number;
  index: number;
  content: string;
  is_checked: boolean;
  created_at: string;
};

type Context = {
  previousChecks?: Check[];
};

type Response = Check;

type Payload = {
  id: number;
  cardId: number;
};

export const deleteCheckById = async (payload: Payload): Promise<Response> => {
  const res = await axios.delete(`/api/checks/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCheckById, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.cardId }];

      await queryClient.cancelQueries(key);

      const previousChecks = queryClient.getQueryData<Check[]>(key);

      if (previousChecks) {
        const newChecks = previousChecks
          .filter((check) => check.id !== payload.id)
          .map((check, index) => ({
            ...check,
            index,
          }));

        queryClient.setQueryData<Check[]>(key, newChecks);
      }

      return { previousChecks };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousChecks) {
        queryClient.setQueryData(
          ["checks", { card_id: payload.cardId }],
          context.previousChecks
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["checks", { card_id: payload.cardId }]);
    },
  });
};

export default useDeleteCheckMutation;
