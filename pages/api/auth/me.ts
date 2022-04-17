import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const token = req.headers.authorization?.split(" ")[1] || "";

    const { user, error } = await supabase.auth.api.getUser(token);

    if (error) {
      throw error;
    }

    res.status(200).json({
      data: user,
      message: "User data successfully found.",
    });
  } catch (error: any) {
    res.status(error.status).json({ message: error.message });
  }
};

export default handler;
