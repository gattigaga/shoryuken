import axios from "axios";
import { useQuery } from "react-query";

type Response = any;

const getMe = async (): Promise<Response> => {
  const res = await axios.get("/api/auth/me");
  const data = res.data.data;

  return {
    fullname: data.user_metadata.fullname || data.user_metadata.full_name,
    username: data.user_metadata.username,
    email: data.email,
    is_confirmed: !!data.email_confirmed_at,
  };
};

const useUserQuery = () => useQuery("me", getMe);

export default useUserQuery;
