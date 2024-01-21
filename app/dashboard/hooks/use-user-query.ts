import axios from "axios";
import { useQuery } from "react-query";

import { User } from "../../types/models";

type Response = User;

const action = async (): Promise<Response> => {
  const res = await axios.get("/api/auth/me");
  const data = res.data.data;

  return data;
};

const useUserQuery = () => useQuery<User, Error>("me", action);

export default useUserQuery;
