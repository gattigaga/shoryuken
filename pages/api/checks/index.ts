import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";
import { getSlug } from "../../../helpers/formatter";

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

  // Get all checks in a card.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { card_id } = req.query as {
        card_id: string | number;
      };

      const { data: checks, error: checksError } = await supabase
        .from("checks")
        .select("*")
        .eq("card_id", card_id)
        .order("index");

      if (checksError) {
        throw checksError;
      }

      res.status(200).json({
        data: checks,
        message: "There are existing checks.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Create a new check for a card.
  if (req.method === "POST") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { content, card_id } = req.body as {
        content: string;
        card_id: string | number;
      };

      const { data: checks, error: checksError } = await supabase
        .from("checks")
        .select("*")
        .eq("card_id", card_id);

      if (checksError) {
        throw checksError;
      }

      const { data: check, error: checkError } = await supabase
        .from("checks")
        .insert([
          {
            content,
            card_id,
            index: checks.length,
          },
        ])
        .limit(1)
        .single();

      if (checkError) {
        throw checkError;
      }

      res.status(200).json({
        data: check,
        message: "Card successfully created.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
