import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

type Body = {
  password: string;
  confirm_password: string;
};

type Payload = {
  body: Body;
};

const action = async (payload: Payload): Promise<Response> => {
  await axios.post("/api/auth/reset-password", payload.body);
};

const useResetPasswordMutation = () => useMutation(action);

export default useResetPasswordMutation;
