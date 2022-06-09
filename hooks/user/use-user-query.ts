import axios from "axios";
import { useQuery } from "react-query";

type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  is_confirmed: boolean;
};

type Response = User;

const getMe = async (): Promise<Response> => {
  const res = await axios.get("/api/auth/me");
  const data = res.data.data;

  return {
    id: data.id,
    fullname: data.user_metadata.fullname || data.user_metadata.full_name,
    username: data.user_metadata.username,
    email: data.email,
    is_confirmed: !!data.email_confirmed_at,
  };
};

const useUserQuery = () => useQuery<User, Error>("me", getMe);

export default useUserQuery;
