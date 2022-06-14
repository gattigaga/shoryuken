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

  // Get a list user has.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { data: list, error: listError } = await supabase
        .from("lists")
        .select("*")
        .eq("id", id)
        .limit(1)
        .single();

      if (listError) {
        throw listError;
      }

      res.status(200).json({
        data: list,
        message: "There's existing list.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Update a list user has.
  if (req.method === "PUT") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { title, index } = req.body as {
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
            (newIndex) => newIndex === index
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

      res.status(200).json({
        data: newList,
        message: "List successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Delete a list user has.
  if (req.method === "DELETE") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      // Get cards that list has.
      const { data: cards, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", id)
        .order("index");

      if (cardsError) {
        throw cardsError;
      }

      // Delete checks that card has.
      for (const card of cards) {
        const { error } = await supabase
          .from("checks")
          .delete()
          .eq("card_id", card.id);

        if (error) {
          throw error;
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

      res.status(200).json({
        data: deletedList,
        message: "List successfully deleted.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
