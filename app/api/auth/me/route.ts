import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";

export const GET = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error } = await supabase.auth.api.getUser(token);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        data: user,
        message: "User data successfully found.",
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

export const PUT = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { fullname, username, password, confirm_password } =
      (await request.json()) as {
        fullname: string;
        username: string;
        password: string;
        confirm_password: string;
      };

    if (password && password !== confirm_password) {
      return new Response(
        JSON.stringify({
          message: "Password and Confirm Password is mismatch.",
        }),
        {
          status: 400,
        }
      );
    }

    const { user, error } = await supabase.auth.api.updateUser(token || "", {
      password,
      data: {
        fullname,
        username,
      },
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        data: user,
        message: "User data successfully updated.",
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
