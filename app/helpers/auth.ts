import { cookies } from "next/headers";

import supabase from "./supabase";

export const getUser = async () => {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("access_token");

  const { user } = await supabase.auth.api.getUser(accessToken?.value || "");

  if (!user) {
    return null;
  }

  const newUser = {
    id: user.id,
    fullname: user.user_metadata.fullname || user.user_metadata.full_name || "",
    username: user.user_metadata.username || "",
    email: user.email || "",
    isConfirmed: !!user.email_confirmed_at,
  };

  return newUser;
};
