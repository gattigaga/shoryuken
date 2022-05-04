import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";

import { getSlug } from "../../helpers/formatter";

type Response = any;

type Body = {
  title: string;
};

const createBoard = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/boards", body);
  const data = res.data.data;

  return data;
};

const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createBoard, {
    onMutate: async (payload) => {
      await queryClient.cancelQueries("boards");

      const previousBoards = queryClient.getQueryData("boards");
      const myself = queryClient.getQueryData("me");

      const newBoard = {
        id: uuid(),
        user_id: myself?.id,
        slug: getSlug(payload.title),
        ...payload,
      };

      queryClient.setQueryData("boards", (oldBoards) => [
        ...oldBoards,
        newBoard,
      ]);

      return { previousBoards };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData("boards", context.previousBoards);
    },
    onSettled: () => {
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useCreateBoardMutation;
