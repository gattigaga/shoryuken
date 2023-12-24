import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

type Body = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Payload = {
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  await axios.post("/api/auth/signup", {
    ...payload.body,
    confirm_password: payload.body.confirmPassword,
  });
};

const useSignUpMutation = () => useMutation(action);

export default useSignUpMutation;
