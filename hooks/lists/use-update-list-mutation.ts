import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Response = any;

type Body = {
  title?: string;
  index?: number;
};

export const updateListById = async ({
  id,
  boardId,
  body,
}: {
  id: number;
  boardId: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/lists/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateListBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateListById, {
    onMutate: async (payload) => {
      const key = ["lists", { board_id: payload.boardId }];

      await queryClient.cancelQueries(key);

      const previousLists = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldLists) => {
        let newLists = oldLists;

        // Update index across all lists in a board.
        if (payload.body.index !== undefined) {
          const list = oldLists.find((list) => list.id === payload.id);
          const fromIndex = list.index;
          const toIndex = payload.body.index;

          newLists = moveElement(oldLists, fromIndex, toIndex).map(
            (list, index) => ({
              ...list,
              index,
            })
          );
        }

        return newLists.map((list) => {
          if (list.id === payload.id) {
            return {
              ...list,
              title: payload.body.title || list.title,
            };
          }

          return list;
        });
      });

      return { previousLists };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(
        ["lists", { board_id: payload.boardId }],
        context.previousLists
      );
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries(["lists", { board_id: payload.boardId }]);
    },
  });
};

export default useUpdateListBoardMutation;
