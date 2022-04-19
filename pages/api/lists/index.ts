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

  // Get all lists user has.
  if (req.method === "GET") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { board_id } = req.query as {
        board_id: string | number;
      };

      const { data: lists, error: listsError } = await supabase
        .from("lists")
        .select("*")
        .eq("board_id", board_id);

      if (listsError) {
        throw listsError;
      }

      res.status(200).json({
        data: lists,
        message: "There are existing lists.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Create a new list for a user.
  if (req.method === "POST") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { title, index, board_id } = req.body as {
        title: string;
        index: number;
        board_id: string | number;
      };

      const { data: lists, error: listsError } = await supabase
        .from("lists")
        .insert([{ title, index, board_id }]);

      if (listsError) {
        throw listsError;
      }

      res.status(200).json({
        data: lists,
        message: "List successfully created.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
