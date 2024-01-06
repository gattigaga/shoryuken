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

    const { data: dueDates, error: dueDatesError } = await supabase
      .from("due_dates")
      .select("*")
      .eq("card_id", cardId);

    if (dueDatesError) {
      throw dueDatesError;
    }

    return new Response(
      JSON.stringify({
        data: dueDates,
        message: "There are existing due dates.",
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

    const { timestamp, card_id } = (await request.json()) as {
      timestamp: string;
      card_id: string | number;
    };

    const { data: dueDate, error: dueDateError } = await supabase
      .from("due_dates")
      .insert([
        {
          timestamp,
          card_id,
        },
      ])
      .limit(1)
      .single();

    if (dueDateError) {
      throw dueDateError;
    }

    return new Response(
      JSON.stringify({
        data: dueDate,
        message: "Due date successfully created.",
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
