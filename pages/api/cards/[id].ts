import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";
import { moveElement } from "../../../helpers/data-structures";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (!["GET", "PUT", "DELETE"].includes(req.method || "")) {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const token = req.cookies.access_token;

  // Get a card user has.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { data: cards, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id);

      if (cardsError) {
        throw cardsError;
      }

      res.status(200).json({
        data: cards[0],
        message: "There's existing card.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Update a card user has.
  if (req.method === "PUT") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { title, description, index, has_checklist, list_id } =
        req.body as {
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
          const newIndex = newIndices.findIndex(
            (newIndex) => newIndex === index
          );

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

      const { data: newCards, error: newCardsError } = await supabase
        .from("cards")
        .update({ title, description, has_checklist })
        .eq("id", id);

      if (newCardsError) {
        throw newCardsError;
      }

      if (has_checklist === false) {
        await supabase.from("checks").delete().eq("card_id", id);
      }

      res.status(200).json({
        data: newCards[0],
        message: "Card successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Delete a card user has.
  if (req.method === "DELETE") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      // Delete a card by id.
      const { data: deletedCard, error: deletedCardError } = await supabase
        .from("cards")
        .delete()
        .eq("id", id)
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

      res.status(200).json({
        data: deletedCard,
        message: "Card successfully deleted.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
