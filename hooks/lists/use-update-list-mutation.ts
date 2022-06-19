import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";
import { List } from "../../types/models";

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

export const updateListById = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/lists/${payload.id}`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateListBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateListById, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.boardId }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData<List[]>(key);
      const { body } = payload;

      if (previousLists) {
        let newLists = [...previousLists];

        // Update index across all lists in a board.
        if (body.index !== undefined) {
          const list = previousLists.find((list) => list.id === payload.id);
          const fromIndex = list?.index;
          const toIndex = body.index;

          if (fromIndex) {
            newLists = moveElement(newLists, fromIndex, toIndex).map(
              (list, index) => ({
                ...list,
                index,
              })
            );
          }
        }

        newLists = newLists.map((list) => {
          if (list.id === payload.id) {
            return {
              ...list,
              title: body.title || list.title,
            };
          }

          return list;
        });

        queryClient.setQueryData<List[]>(key, newLists);
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
      queryClient.invalidateQueries(["lists", { board_id: payload.boardId }]);
    },
  });
};

export default useUpdateListBoardMutation;
