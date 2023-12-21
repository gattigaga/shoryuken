import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

type Body = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

type Payload = {
  body: Body;
};

const postSignUp = async (payload: Payload): Promise<Response> => {
  await axios.post("/api/auth/signup", payload.body);
};

const useSignUpMutation = () => useMutation(postSignUp);

export default useSignUpMutation;
