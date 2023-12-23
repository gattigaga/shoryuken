import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../app/helpers/supabase";

type Content = {
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const token = req.cookies.access_token;

    const { password, confirm_password } = req.body as {
      password: string;
      confirm_password: string;
    };

    if (password !== confirm_password) {
      res
        .status(400)
        .json({ message: "Password and Confirm Password is mismatch." });
      return;
    }

    const { error } = await supabase.auth.api.updateUser(token, {
      password,
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "Password successfully reset.",
    });
  } catch (error: any) {
    res.status(error.status).json({ message: error.message });
  }
};

export default handler;
