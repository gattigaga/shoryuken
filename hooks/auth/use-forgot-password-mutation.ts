import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  email: string;
};

const postForgotPassword = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/auth/forgot-password", body);
  const data = res.data.data;

  return data;
};

const useForgotPasswordMutation = () => useMutation(postForgotPassword);

export default useForgotPasswordMutation;
