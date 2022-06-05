import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

export const deleteCheckById = async ({
  id,
  cardId,
}: {
  id: number;
  cardId: number;
}): Promise<Response> => {
  const res = await axios.delete(`/api/checks/${id}`);
  const data = res.data.data;

  return data;
};

const useDeleteCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCheckById, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.cardId }];

      await queryClient.cancelQueries(key);

      const previousChecks = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldChecks) => {
        return oldChecks
          .filter((check) => check.id !== payload.id)
          .map((check, index) => ({
            ...check,
            index,
          }));
      });

      return { previousChecks };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["checks", { card_id: payload.cardId }],
        context.previousChecks
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["checks", { card_id: payload.cardId }]);
    },
  });
};

export default useDeleteCheckMutation;
