import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  is_confirmed: boolean;
};

type Context = {
  previousUser?: User;
};

type Response = User;

type Body = {
  fullname?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
};

type Payload = {
  body: Body;
};

export const updateUser = async (payload: Payload): Promise<Response> => {
  const res = await axios.put(`/api/auth/me`, payload.body);
  const data = res.data.data;

  return data;
};

const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onMutate: async (payload) => {
      const key = "me";

      await queryClient.cancelQueries(key);

      const previousUser = queryClient.getQueryData<User>(key);
      const { body } = payload;

      if (previousUser) {
        queryClient.setQueryData<User>(key, {
          ...previousUser,
          fullname: body.fullname || previousUser.fullname,
          username: body.username || previousUser.username,
        });
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
