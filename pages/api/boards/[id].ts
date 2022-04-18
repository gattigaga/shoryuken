import type { NextApiRequest, NextApiResponse } from "next";

import { getSlug } from "../../../helpers/formatter";
import supabase from "../../../helpers/supabase";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (!["GET", "PUT"].includes(req.method || "")) {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1] || "";

  // Get a board user has.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id);

      if (boardsError) {
        throw boardsError;
      }

      res.status(200).json({
        data: boards[0],
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

      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .update({ title, slug })
        .eq("id", id);

      if (boardsError) {
        throw boardsError;
      }

      res.status(200).json({
        data: boards[0],
        message: "Board successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
