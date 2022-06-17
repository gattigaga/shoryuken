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
  timestamp: string;
  card_id: number;
};

type Payload = {
  body: Body;
};

const createDueDate = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/due-dates", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateDueDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createDueDate, {
    onMutate: async (payload) => {
      const { body } = payload;
      const key = ["due_dates", { card_id: body.card_id }];

      await queryClient.cancelQueries(key);

      const previousDueDates = queryClient.getQueryData<DueDate[]>(key);

      if (previousDueDates) {
        const newDueDate = {
          id: Date.now(),
          is_done: false,
          created_at: new Date().toISOString(),
          ...body,
        };

        queryClient.setQueryData<DueDate[]>(key, [
          ...previousDueDates,
          newDueDate,
        ]);
      }

      return { previousDueDates };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousDueDates) {
        queryClient.setQueryData<DueDate[]>(
          ["due_dates", { card_id: payload.body.card_id }],
          context.previousDueDates
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries([
        "due_dates",
        { card_id: payload.body.card_id },
      ]);
    },
  });
};

export default useCreateDueDateMutation;
