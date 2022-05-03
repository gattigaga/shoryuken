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

      const { title, description, index } = req.body as {
        title: string;
        description: string;
        index: number;
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

      // Update the index of each card.
      if (index !== undefined && index !== card.index) {
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

      const { data: newCards, error: newCardsError } = await supabase
        .from("cards")
        .update({ title, description })
        .eq("id", id);

      if (newCardsError) {
        throw newCardsError;
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
