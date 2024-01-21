import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";

import { User } from "../../../types/models";

type Context = {
  previousUser?: User;
};

type Response = User;

type Body = {
  avatar?: string;
  fullname?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
};

type Payload = {
  body: Body;
};

export const action = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/auth/me`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(action, {
    onMutate: async (payload) => {
      const key = "me";

      await queryClient.cancelQueries(key);

      const previousUser = queryClient.getQueryData<User>(key);
      const { body } = payload;

      if (previousUser) {
        const data = produce(previousUser, (draft) => {
          if (body.avatar) {
            draft.avatar = body.avatar;
          }

          if (body.fullname) {
            draft.fullname = body.fullname;
          }

          if (body.username) {
            draft.username = body.username;
          }
        });

        queryClient.setQueryData<User>(key, data);
      }

      return { previousUser };
    },
    onError: (error, payload, context?: Context) => {
      if (context?.previousUser) {
        queryClient.setQueryData<User>("me", context.previousUser);
      }
    },
    onSettled: (data, error, payload) => {
      queryClient.invalidateQueries("me");
    },
  });
};

export default useUpdateUserMutation;
