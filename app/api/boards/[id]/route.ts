import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";
import { getSlug } from "../../../helpers/formatter";
import { getHttpStatusCode } from "../../../helpers/others";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { id } = params;

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .eq("user_id", user?.id)
      .limit(1)
      .maybeSingle();

    if (boardError) {
      throw boardError;
    }

    if (!board) {
      return new Response(
        JSON.stringify({
          message: "Board doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: board,
        message: "There's existing board.",
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

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { id } = params;

    const { title, color } = (await request.json()) as {
      title: string;
      color: string;
    };

    const slug = getSlug(title);

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .update({ title, color, slug })
      .eq("id", id)
      .order("id")
      .limit(1)
      .maybeSingle();

    if (boardError) {
      throw boardError;
    }

    if (!board) {
      return new Response(
        JSON.stringify({
          message: "Board doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: board,
        message: "Board successfully updated.",
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

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { id } = params;

    // Get lists that board has.
    const { data: lists, error: listsError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", id)
      .order("index");

    if (listsError) {
      throw listsError;
    }

    for (const list of lists) {
      // Get cards that list has.
      const { data: cards, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", list.id)
        .order("index");

      if (cardsError) {
        throw cardsError;
      }

      // Delete due dates and checks that card has.
      for (const card of cards) {
        const { error: deletedDueDatesError } = await supabase
          .from("due_dates")
          .delete()
          .eq("card_id", card.id);

        if (deletedDueDatesError) {
          throw deletedDueDatesError;
        }

        const { error: deletedChecksError } = await supabase
          .from("checks")
          .delete()
          .eq("card_id", card.id);

        if (deletedChecksError) {
          throw deletedChecksError;
        }
      }

      // Delete cards that list has.
      const { error: deletedCardsError } = await supabase
        .from("cards")
        .delete()
        .eq("list_id", list.id);

      if (deletedCardsError) {
        throw deletedCardsError;
      }
    }

    // Delete lists that board has.
    const { error: deletedListsError } = await supabase
      .from("lists")
      .delete()
      .eq("board_id", id);

    if (deletedListsError) {
      throw deletedListsError;
    }

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .delete()
      .eq("id", id)
      .order("id")
      .limit(1)
      .maybeSingle();

    if (boardError) {
      throw boardError;
    }

    if (!board) {
      return new Response(
        JSON.stringify({
          message: "Board doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: board,
        message: "Board successfully deleted.",
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
