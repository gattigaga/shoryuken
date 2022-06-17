import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (!["GET", "POST"].includes(req.method || "")) {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const token = req.cookies.access_token;

  // Get due date in a card.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { card_id } = req.query as {
        card_id: string | number;
      };

      const { data: dueDates, error: dueDatesError } = await supabase
        .from("due_dates")
        .select("*")
        .eq("card_id", card_id);

      if (dueDatesError) {
        throw dueDatesError;
      }

      res.status(200).json({
        data: dueDates,
        message: "There are existing due dates.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Create a new due date for a card.
  if (req.method === "POST") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { timestamp, card_id } = req.body as {
        timestamp: string;
        card_id: string | number;
      };

      const { data: dueDate, error: dueDateError } = await supabase
        .from("checks")
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

      res.status(200).json({
        data: dueDate,
        message: "Due date successfully created.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
