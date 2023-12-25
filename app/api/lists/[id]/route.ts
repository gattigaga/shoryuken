import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import supabase from "../../../helpers/supabase";
import { moveElement } from "../../../helpers/data-structures";

export const GET = async (
  request: NextRequest,
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

    const { data: list, error: listError } = await supabase
      .from("lists")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (listError) {
      throw listError;
    }

    return new Response(
      JSON.stringify({
        data: list,
        message: "There's existing list.",
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

    const { title, index } = (await request.json()) as {
      title: string;
      index: number;
    };

    // Get a list that want to update.
    const { data: list, error: listError } = await supabase
      .from("lists")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (listError) {
      throw listError;
    }

    // Update the index of each list.
    if (index !== undefined) {
      const { data: orderedLists, error: orderedListsError } = await supabase
        .from("lists")
        .select("*")
        .eq("board_id", list.board_id)
        .order("index");

      if (orderedListsError) {
        throw orderedListsError;
      }

      const newIndices = (() => {
        const prevIndex = list.index;
        const newIndex = index;
        const indices = orderedLists.map((list) => list.index);
        const result = moveElement(indices, prevIndex, newIndex);

        return result;
      })();

      for (const [index, orderedList] of orderedLists.entries()) {
        const newIndex = newIndices.findIndex(
          (newIndex: number) => newIndex === index
        );

        const { error } = await supabase
          .from("lists")
          .update({ index: newIndex })
          .eq("id", orderedList.id);

        if (error) {
          throw error;
        }
      }
    }

    const { error: newListsError } = await supabase
      .from("lists")
      .update({ title })
      .eq("id", id);

    if (newListsError) {
      throw newListsError;
    }

    const { data: newList, error: newListError } = await supabase
      .from("lists")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (newListError) {
      throw newListError;
    }

    return new Response(
      JSON.stringify({
        data: newList,
        message: "List successfully updated.",
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

export const DELETE = async (
  request: NextRequest,
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

    // Get cards that list has.
    const { data: cards, error: cardsError } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", id)
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
      .eq("list_id", id);

    if (deletedCardsError) {
      throw deletedCardsError;
    }

    // Delete a list by id.
    const { data: deletedList, error: deletedListError } = await supabase
      .from("lists")
      .delete()
      .eq("id", id)
      .order("id")
      .limit(1)
      .single();

    if (deletedListError) {
      throw deletedListError;
    }

    // Get lists by board ID in order by index.
    const { data: orderedLists, error: orderedListsError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", deletedList.board_id)
      .order("index");

    if (orderedListsError) {
      throw orderedListsError;
    }

    // Update the index of each list.
    for (const [index, orderedList] of orderedLists.entries()) {
      const { error } = await supabase
        .from("lists")
        .update({ index })
        .eq("id", orderedList.id);

      if (error) {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        data: deletedList,
        message: "List successfully deleted.",
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
