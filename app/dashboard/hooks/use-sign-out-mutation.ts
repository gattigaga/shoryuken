import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

const action = async (): Promise<Response> => {
  await axios.post("/api/auth/signout");
};

const useSignOutMutation = () => useMutation(action);

export default useSignOutMutation;
