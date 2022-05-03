import axios from "axios";
import { useMutation } from "react-query";

type Response = {
  user: any;
  session: any;
};

type Body = {
  email: string;
  password: string;
};

const postSignIn = async (body: Body): Promise<Response> => {
  const res = await axios.post("/api/auth/signin", body);
  const data = res.data.data;

  return data;
};

const useSignInMutation = () => useMutation(postSignIn);

export default useSignInMutation;
