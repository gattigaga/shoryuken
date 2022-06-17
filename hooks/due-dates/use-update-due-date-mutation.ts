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

type Body = {
  timestamp?: string;
  is_done?: boolean;
};

type Payload = {
  id: number;
  cardId: number;
  body: Body;
};

export const updateDueDateById = async (
  payload: Payload
): Promise<Response> => {
  const res = await axios.put(`/api/due-dates/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateDueDateById, {
    onMutate: async (payload) => {
      const key = ["due_dates", { card_id: payload.cardId }];

      await queryClient.cancelQueries(key);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);
      const { body } = payload;

      if (previousDueDates) {
        const newDueDates = previousDueDates.map((dueDate) => {
          if (dueDate.id === payload.id) {
            const isDone =
              body.is_done !== undefined ? body.is_done : dueDate.is_done;

            return {
              ...dueDate,
              content: body.timestamp || dueDate.timestamp,
              is_done: isDone,
            };
          }

          return dueDate;
        });

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

export default useUpdateDueDateMutation;
