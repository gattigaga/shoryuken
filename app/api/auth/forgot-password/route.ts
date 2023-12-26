import supabase from "../../../helpers/supabase";

export const POST = async (request: Request) => {
  try {
    const { email } = (await request.json()) as {
      email: string;
    };

    const { error } = await supabase.auth.api.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Recovery link sent successfully.",
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
