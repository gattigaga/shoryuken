import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error } = await supabase.auth.api.signOut(token);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "User successfully signed out.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: error.status,
      }
    );
  }
};
