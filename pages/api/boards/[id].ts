import type { NextApiRequest, NextApiResponse } from "next";

import { getSlug } from "../../../helpers/formatter";
import supabase from "../../../app/helpers/supabase";

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

  // Get a board user has.
  if (req.method === "GET") {
    try {
      const { user, error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { data: board, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id)
        .eq("user_id", user!.id)
        .limit(1)
        .single();

      if (boardError) {
        throw boardError;
      }

      res.status(200).json({
        data: board,
        message: "There's existing board.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Update a board user has.
  if (req.method === "PUT") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { title } = req.body as {
        title: string;
      };

      const slug = getSlug(title);

      const { data: board, error: boardError } = await supabase
        .from("boards")
        .update({ title, slug })
        .eq("id", id)
        .order("id")
        .limit(1)
        .single();

      if (boardError) {
        throw boardError;
      }

      res.status(200).json({
        data: board,
        message: "Board successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Delete a board user has.
  if (req.method === "DELETE") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

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
        .single();

      if (boardError) {
        throw boardError;
      }

      res.status(200).json({
        data: board,
        message: "Board successfully deleted.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
