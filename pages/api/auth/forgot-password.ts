import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";

type Content = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const { email } = req.body as {
      email: string;
    };

    const { error } = await supabase.auth.api.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "Recovery link sent successfully.",
    });
  } catch (error: any) {
    res.status(error.status).json({ message: error.message });
  }
};

export default handler;
