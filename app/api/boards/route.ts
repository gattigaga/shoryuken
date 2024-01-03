import { cookies } from "next/headers";

import supabase from "../../helpers/supabase";
import { getSlug } from "../../helpers/formatter";
import { getHttpStatusCode } from "../../helpers/others";

export const GET = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { data: boards, error: boardsError } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at");

    if (boardsError) {
      throw boardsError;
    }

    return new Response(
      JSON.stringify({
        data: boards,
        message: "There are existing boards.",
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

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { title } = (await request.json()) as {
      title: string;
    };

    const slug = getSlug(title);

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert([{ title, slug, user_id: user?.id }])
      .limit(1)
      .single();

    if (boardError) {
      throw boardError;
    }

    return new Response(
      JSON.stringify({
        data: board,
        message: "Board successfully created.",
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
