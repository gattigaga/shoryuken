import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../app/helpers/supabase";

type Content = {
  data?: {
    user: any;
    session: any;
  };
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      data: {
        user,
        session,
      },
      message: "User successfully signed in.",
    });
  } catch (error: any) {
    res.status(error.status).json({ message: error.message });
  }
};

export default handler;
