import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";
import { getHttpStatusCode } from "../../../helpers/others";

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { password, confirm_password } = (await request.json()) as {
      password: string;
      confirm_password: string;
    };

    if (password !== confirm_password) {
      return new Response(
        JSON.stringify({
          message: "Password and Confirm Password is mismatch.",
        }),
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase.auth.api.updateUser(token, {
      password,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Password successfully reset.",
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
        status: error.status || getHttpStatusCode(error.code) || 500,
      }
    );
  }
};
