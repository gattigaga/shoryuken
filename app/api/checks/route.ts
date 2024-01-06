import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import supabase from "../../helpers/supabase";
import { getHttpStatusCode } from "../../helpers/others";

export const GET = async (request: NextRequest) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const searchParams = request.nextUrl.searchParams;
    const cardId = searchParams.get("card_id");

    const { data: checks, error: checksError } = await supabase
      .from("checks")
      .select("*")
      .eq("card_id", cardId)
      .order("index");

    if (checksError) {
      throw checksError;
    }

    return new Response(
      JSON.stringify({
        data: checks,
        message: "There are existing checks.",
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

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { content, card_id } = (await request.json()) as {
      content: string;
      card_id: string | number;
    };

    const { data: checks, error: checksError } = await supabase
      .from("checks")
      .select("*")
      .eq("card_id", card_id);

    if (checksError) {
      throw checksError;
    }

    const { data: check, error: checkError } = await supabase
      .from("checks")
      .insert([
        {
          content,
          card_id,
          index: checks.length,
        },
      ])
      .limit(1)
      .single();

    if (checkError) {
      throw checkError;
    }

    return new Response(
      JSON.stringify({
        data: check,
        message: "Card successfully created.",
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
