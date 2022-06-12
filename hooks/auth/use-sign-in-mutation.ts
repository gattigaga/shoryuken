import axios from "axios";
import { useMutation } from "react-query";

type Response = string;

type Body = {
  email: string;
  password: string;
};

type Payload = {
  body: Body;
};

const postSignIn = async (payload: Payload): Promise<Response> => {
  const res = await axios.post("/api/auth/signin", payload.body);
  const data = res.data.data.session.access_token;

  return data;
};

const useSignInMutation = () => useMutation(postSignIn);

export default useSignInMutation;
