import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type Response = any;

type Body = {
  title: string;
};

export const updateBoardById = async ({
  id,
  body,
}: {
  id: string | number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/boards/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateBoardById, {
    onMutate: async (payload) => {
      const key = ["boards", payload.id];

      await queryClient.cancelQueries(key);

      const previousBoard = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldBoard) => ({
        ...oldBoard,
        title: payload.body.title,
      }));

      return { previousBoard };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(["boards", payload.id], context.previousBoard);
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["boards", payload.id]);
    },
  });
};

export default useUpdateBoardMutation;
