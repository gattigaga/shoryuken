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

  // Create a new card for a user.
  if (req.method === "POST") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { title, list_id } = req.body as {
        title: string;
        list_id: string | number;
      };

      const slug = getSlug(title);

      const { data: cards, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("list_id", list_id);

      if (cardsError) {
        throw cardsError;
      }

      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert([
          {
            title,
            slug,
            list_id,
            index: cards.length,
          },
        ])
        .limit(1)
        .single();

      if (cardError) {
        throw cardError;
      }

      res.status(200).json({
        data: card,
        message: "Card successfully created.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
