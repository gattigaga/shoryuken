import axios from "axios";
import { useMutation } from "react-query";

type Response = any;

type Body = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

const postSignUp = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/auth/signup", body);
  const data = res.data.data;

  return data;
};

const useSignUpMutation = () => useMutation(postSignUp);

export default useSignUpMutation;
