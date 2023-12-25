import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { moveElement } from "../../../../../helpers/data-structures";
import { List } from "../../../../../types/models";

type Context = {
  previousLists?: List[];
};

type Response = List;

type Body = {
  title?: string;
  index?: number;
};

type Payload = {
  id: number;
  boardId: number;
  body: Body;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/lists/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateListBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.boardId }];

      await queryClient.cancelQueries("lists");

      const previousLists = queryClient.getQueryData<List[]>(key);
      const { body } = payload;

      if (previousLists) {
        const data = produce(previousLists, (draft) => {
          const index = draft.findIndex((item) => item.id === payload.id);

          if (index !== -1) {
            // Update index across all lists in a board.
            if (body.index !== undefined) {
              const fromIndex = index;
              const toIndex = body.index;

              return moveElement(draft, fromIndex, toIndex).map(
                (list, index) => ({
                  ...list,
                  index,
                })
              );
            }

            if (body.title) {
              draft[index].title = body.title;
            }
          }
        });

        queryClient.setQueryData<List[]>(key, data);
      }

      return { previousLists };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousLists) {
        queryClient.setQueryData<List[]>(
          ["lists", { board_id: payload.boardId }],
          context.previousLists
        );
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries("lists");
    },
  });
};

export default useUpdateListBoardMutation;
