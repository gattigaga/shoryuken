import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type DueDate = {
  id: number;
  card_id: number;
  timestamp: string;
  is_done: boolean;
  created_at: string;
};

type Context = {
  previousDueDates?: DueDate[];
};

type Response = DueDate;

type Payload = {
  id: number;
  cardId: number;
};

export const deleteDueDateById = async (
  payload: Payload
): Promise<Response> => {
  const res = await axios.delete(`/api/due-dates/${payload.id}`);
  const data = res.data.data;

  return data;
};

const useDeleteDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteDueDateById, {
    onMutate: async (payload) => {
      const key = ["due_dates", { card_id: payload.cardId }];

      await queryClient.cancelQueries(key);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);

      if (previousDueDates) {
        const newDueDates = previousDueDates.filter(
          (dueDate) => dueDate.id !== payload.id
        );

        queryClient.setQueryData<DueDate[]>(key, newDueDates);
      }

      return { previousDueDates };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousDueDates) {
        queryClient.setQueryData(
          ["due_dates", { card_id: payload.cardId }],
          context.previousDueDates
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["due_dates", { card_id: payload.cardId }]);
    },
  });
};

export default useDeleteDueDateMutation;
