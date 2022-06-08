import type { NextApiRequest, NextApiResponse } from "next";

import { getSlug } from "../../../helpers/formatter";
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

  // Get all boards user has.
  if (req.method === "GET") {
    try {
      const { user, error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at");

      if (boardsError) {
        throw boardsError;
      }

      res.status(200).json({
        data: boards,
        message: "There are existing boards.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Create a new board for a user.
  if (req.method === "POST") {
    try {
      const { user, error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { title } = req.body as {
        title: string;
      };

      const slug = getSlug(title);

      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .insert([{ title, slug, user_id: user?.id }]);

      if (boardsError) {
        throw boardsError;
      }

      res.status(200).json({
        data: boards,
        message: "Board successfully created.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
