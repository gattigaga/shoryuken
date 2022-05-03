import axios from "axios";
import { useMutation } from "react-query";

type Response = void;

const postSignOut = async (): Promise<Response> => {
  await axios.post("/api/auth/signout");
};

const useSignOutMutation = () => useMutation(postSignOut);

export default useSignOutMutation;
