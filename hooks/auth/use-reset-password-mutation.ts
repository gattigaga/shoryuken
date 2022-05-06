import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  password: string;
  confirm_password: string;
};

const postResetPassword = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/auth/reset-password", body);
  const data = res.data.data;

  return data;
};

const useResetPasswordMutation = () => useMutation(postResetPassword);

export default useResetPasswordMutation;
