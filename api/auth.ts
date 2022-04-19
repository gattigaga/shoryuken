import axios from "axios";

export const postSignOut = async () => {
  const res = await axios.post("/api/auth/signout");

  return res.data.data;
};
