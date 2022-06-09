import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

type Body = {
  email: string;
};

type Payload = {
  body: Body;
};

const postForgotPassword = async (payload: Payload): Promise<Response> => {
  await axios.post("/api/auth/forgot-password", payload.body);
};

const useForgotPasswordMutation = () => useMutation(postForgotPassword);

export default useForgotPasswordMutation;
