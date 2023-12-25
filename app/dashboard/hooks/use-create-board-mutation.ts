import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { getSlug } from "../../helpers/formatter";
import { Board, User } from "../../../types/models";

type Context = {
  previousBoards?: Board[];
};

type Response = Board;

type Body = {
  title: string;
};

type Payload = {
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/boards", payload.body);
  const data = res.data.data;

  return data;
};

const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = "boards";

      await queryClient.cancelQueries(key);

      const previousBoards = queryClient.getQueryData<Board[]>(key);
      const previousMe = queryClient.getQueryData<User>("me");
      const { body } = payload;

      if (previousBoards && previousMe) {
        const newBoard: Board = {
          id: Date.now(),
          user_id: previousMe.id,
          slug: getSlug(body.title),
          created_at: new Date().toISOString(),
          ...body,
        };

        const data = produce(previousBoards, (draft) => {
          draft.push(newBoard);
        });

        queryClient.setQueryData<Board[]>(key, data);
      }

      return { previousBoards };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData<Board[]>("boards", context.previousBoards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("boards");
    },
  });
};

export default useCreateBoardMutation;
