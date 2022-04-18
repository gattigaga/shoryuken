import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../helpers/supabase";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  if (req.method === "GET") {
    try {
      const { user, error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user?.id);

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
};

export default handler;
