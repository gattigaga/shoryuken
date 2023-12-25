import supabase from "../../../helpers/supabase";

export const POST = async (request: Request) => {
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        data: {
          user,
          session,
        },
        message: "User successfully signed in.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    });
  }
};
