import supabase from "../../../helpers/supabase";

export const POST = async (request: Request) => {
  try {
    const { fullname, username, email, password, confirm_password } =
      (await request.json()) as {
        fullname: string;
        username: string;
        email: string;
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

    const { user, error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        data: {
          fullname,
          username,
        },
      }
    );

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        data: user,
        message: "User successfully signed up.",
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
