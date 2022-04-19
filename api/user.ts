import axios from "axios";

export const getMe = async () => {
  const res = await axios.get("/api/auth/me");

  return res.data.data;
};
