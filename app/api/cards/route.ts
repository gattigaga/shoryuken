import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import supabase from "../../helpers/supabase";
import { getSlug } from "../../helpers/formatter";

export const GET = async (request: NextRequest) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const searchParams = request.nextUrl.searchParams;
    const listId = searchParams.get("list_id");

    const { data: cards, error: cardsError } = await supabase
      .from("cards")
      .select(
        `
        *,
        checks(*),
        due_dates(*)
      `
      )
      .eq("list_id", listId)
      .order("index");

    if (cardsError) {
      throw cardsError;
    }

    return new Response(
      JSON.stringify({
        data: cards,
        message: "There are existing cards.",
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

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { title, list_id } = (await request.json()) as {
      title: string;
      list_id: string | number;
    };

    const slug = getSlug(title);

    const { data: cards, error: cardsError } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", list_id);

    if (cardsError) {
      throw cardsError;
    }

    const { data: createdCard, error: createdCardError } = await supabase
      .from("cards")
      .insert([
        {
          title,
          slug,
          list_id,
          index: cards.length,
        },
      ])
      .limit(1)
      .single();

    if (createdCardError) {
      throw createdCardError;
    }

    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select(
        `
        *,
        checks(*),
        due_dates(*)
      `
      )
      .eq("id", createdCard.id)
      .limit(1)
      .single();

    if (cardError) {
      throw cardError;
    }

    return new Response(
      JSON.stringify({
        data: card,
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
        status: error.status,
      }
    );
  }
};
