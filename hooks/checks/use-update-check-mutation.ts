import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { moveElement } from "../../helpers/data-structures";

type Response = any;

type Body = {
  content?: string;
  index?: number;
  is_checked?: boolean;
};

export const updateCheckById = async ({
  id,
  cardId,
  body,
}: {
  id: number;
  cardId: number;
  body: Body;
}): Promise<Response> => {
  const res = await axios.put(`/api/checks/${id}`, body);
  const data = res.data.data;

  return data;
};

const useUpdateCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCheckById, {
    onMutate: async (payload) => {
      const key = ["checks", { card_id: payload.cardId }];

      await queryClient.cancelQueries(key);

      const previousChecks = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (oldChecks) => {
        let newChecks = oldChecks;

        // Update index across all lists in a board.
        if (payload.body.index !== undefined) {
          const check = oldChecks.find((check) => check.id === payload.id);
          const fromIndex = check.index;
          const toIndex = payload.body.index;

          newChecks = moveElement(oldChecks, fromIndex, toIndex).map(
            (check, index) => ({
              ...check,
              index,
            })
          );
        }

        return newChecks.map((check) => {
          if (check.id === payload.id) {
            return {
              ...check,
              content: payload.body.content || check.content,
              is_checked: payload.body.is_checked || check.is_checked,
            };
          }

          return check;
        });
      });

      return { previousLists: previousChecks };
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

export default useUpdateCheckMutation;
