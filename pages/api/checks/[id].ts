import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";
import { moveElement } from "../../../helpers/data-structures";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (!["PUT", "DELETE"].includes(req.method || "")) {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const token = req.cookies.access_token;

  // Update a check that check has.
  if (req.method === "PUT") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { content, index, is_checked } = req.body as {
        content: string;
        index: number;
        is_checked: boolean;
      };

      // Get a check that want to update.
      const { data: check, error: checkError } = await supabase
        .from("checks")
        .select("*")
        .eq("id", id)
        .limit(1)
        .single();

      if (checkError) {
        throw checkError;
      }

      // Move check in a card.
      if (index !== undefined) {
        const { data: orderedChecks, error: orderedChecksError } =
          await supabase
            .from("checks")
            .select("*")
            .eq("card_id", check.card_id)
            .order("index");

        if (orderedChecksError) {
          throw orderedChecksError;
        }

        const newIndices = (() => {
          const prevIndex = check.index;
          const newIndex = index;
          const indices = orderedChecks.map((check) => check.index);
          const result = moveElement(indices, prevIndex, newIndex);

          return result;
        })();

        for (const [index, orderedCheck] of orderedChecks.entries()) {
          const newIndex = newIndices.findIndex(
            (newIndex) => newIndex === index
          );

          const { error } = await supabase
            .from("checks")
            .update({ index: newIndex })
            .eq("id", orderedCheck.id);

          if (error) {
            throw error;
          }
        }
      }

      const { data: newCheck, error: newCheckError } = await supabase
        .from("checks")
        .update({ content, is_checked })
        .eq("id", id)
        .order("id")
        .limit(1)
        .single();

      if (newCheckError) {
        throw newCheckError;
      }

      res.status(200).json({
        data: newCheck,
        message: "Check successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Delete a check that check has.
  if (req.method === "DELETE") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      // Delete a check by id.
      const { data: deletedCheck, error: deletedCheckError } = await supabase
        .from("checks")
        .delete()
        .eq("id", id)
        .order("id")
        .limit(1)
        .single();

      if (deletedCheckError) {
        throw deletedCheckError;
      }

      // Get checks by card ID in order by index.
      const { data: orderedChecks, error: orderedChecksError } = await supabase
        .from("checks")
        .select("*")
        .eq("card_id", deletedCheck.card_id)
        .order("index");

      if (orderedChecksError) {
        throw orderedChecksError;
      }

      // Update the index of each check.
      for (const [index, orderedCheck] of orderedChecks.entries()) {
        const { error } = await supabase
          .from("checks")
          .update({ index })
          .eq("id", orderedCheck.id);

        if (error) {
          throw error;
        }
      }

      res.status(200).json({
        data: deletedCheck,
        message: "Check successfully deleted.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
