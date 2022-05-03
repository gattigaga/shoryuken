import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

const getMe = async (): Promise<Response> => {
  const res = await axios.get("/api/auth/me");
  const data = res.data.data;

  return data;
};

const useUserQuery = () => useQuery("me", getMe);

export default useUserQuery;
