import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";
import { moveElement } from "../../../helpers/data-structures";

export const GET = async (
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

    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select(
        `
        *,
        checks(*),
        due_dates(*)
      `
      )
      .eq("id", id)
      .limit(1)
      .single();

    if (cardError) {
      throw cardError;
    }

    return new Response(
      JSON.stringify({
        data: card,
        message: "There's existing card.",
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

    const { title, description, index, has_checklist, list_id } =
      (await request.json()) as {
        title: string;
        description: string;
        index: number;
        has_checklist: boolean;
        list_id: number;
      };

    // Get a card that want to update.
    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (cardError) {
      throw cardError;
    }

    // Move card in a list.
    if (index !== undefined && !list_id) {
      const { data: orderedCards, error: orderedCardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", card.list_id)
        .order("index");

      if (orderedCardsError) {
        throw orderedCardsError;
      }

      const newIndices = (() => {
        const prevIndex = card.index;
        const newIndex = index;
        const indices = orderedCards.map((card) => card.index);
        const result = moveElement(indices, prevIndex, newIndex);

        return result;
      })();

      for (const [index, orderedCard] of orderedCards.entries()) {
        const newIndex = newIndices.findIndex((newIndex) => newIndex === index);

        const { error } = await supabase
          .from("cards")
          .update({ index: newIndex })
          .eq("id", orderedCard.id);

        if (error) {
          throw error;
        }
      }
    }

    // Move card in across 2 lists.
    if (list_id) {
      const fromList = card.list_id;
      const toList = list_id;

      const { data: fromCards, error: fromCardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", fromList)
        .order("index");

      if (fromCardsError) {
        throw fromCardsError;
      }

      const { data: toCards, error: toCardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", toList)
        .order("index");

      if (toCardsError) {
        throw toCardsError;
      }

      const updatedFromCards = fromCards.filter((fromCard) => {
        return fromCard.id !== card.id;
      });

      const updatedToCards = [
        ...toCards.slice(0, index),
        card,
        ...toCards.slice(index),
      ];

      for (const [index, fromCard] of updatedFromCards.entries()) {
        const { error } = await supabase
          .from("cards")
          .update({ index })
          .eq("id", fromCard.id);

        if (error) {
          throw error;
        }
      }

      for (const [index, toCard] of updatedToCards.entries()) {
        const listId = card.id === toCard.id ? toList : toCard.list_id;

        const { error } = await supabase
          .from("cards")
          .update({ index, list_id: listId })
          .eq("id", toCard.id);

        if (error) {
          throw error;
        }
      }
    }

    const { error: newCardsError } = await supabase
      .from("cards")
      .update({ title, description, has_checklist })
      .eq("id", id);

    if (newCardsError) {
      throw newCardsError;
    }

    const { data: newCard, error: newCardError } = await supabase
      .from("cards")
      .select(
        `
        *,
        checks(*),
        due_dates(*)
      `
      )
      .eq("id", id)
      .limit(1)
      .single();

    if (newCardError) {
      throw newCardError;
    }

    // Delete checks that card has
    // if checklist disabled.
    if (has_checklist === false) {
      const { error: deletedChecksError } = await supabase
        .from("checks")
        .delete()
        .eq("card_id", id);

      if (deletedChecksError) {
        throw deletedChecksError;
      }
    }

    return new Response(
      JSON.stringify({
        data: newCard,
        message: "Card successfully updated.",
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

    // Delete due dates that card has
    const { error: deletedDueDatesError } = await supabase
      .from("due_dates")
      .delete()
      .eq("card_id", id);

    if (deletedDueDatesError) {
      throw deletedDueDatesError;
    }

    // Delete checks that card has
    const { error: deletedChecksError } = await supabase
      .from("checks")
      .delete()
      .eq("card_id", id);

    if (deletedChecksError) {
      throw deletedChecksError;
    }

    // Delete a card by id.
    const { data: deletedCard, error: deletedCardError } = await supabase
      .from("cards")
      .delete()
      .eq("id", id)
      .order("id")
      .limit(1)
      .single();

    if (deletedCardError) {
      throw deletedCardError;
    }

    // Get cards by list ID in order by index.
    const { data: orderedCards, error: orderedCardsError } = await supabase
      .from("cards")
      .select("*")
      .eq("list_id", deletedCard.list_id)
      .order("index");

    if (orderedCardsError) {
      throw orderedCardsError;
    }

    // Update the index of each card.
    for (const [index, orderedCard] of orderedCards.entries()) {
      const { error } = await supabase
        .from("cards")
        .update({ index })
        .eq("id", orderedCard.id);

      if (error) {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        data: deletedCard,
        message: "Card successfully deleted.",
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
