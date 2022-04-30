import cookie from "cookie";
import supabase from "./supabase";

export const getAuthStatus = async (cookieContent: string) => {
  const cookies = cookie.parse(cookieContent);
  const { error } = await supabase.auth.api.getUser(cookies.access_token);

  return !error;
};
