import type { NextApiRequest, NextApiResponse } from "next";

import supabase from "../../../helpers/supabase";

type Content = {
  data?: any;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Content>) => {
  if (!["PUT", "DELETE"].includes(req.method || "")) {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const token = req.cookies.access_token;

  // Update a due date that card has.
  if (req.method === "PUT") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      const { timestamp, is_done } = req.body as {
        timestamp: string;
        is_done: boolean;
      };

      const { data: newDueDate, error: newDueDateError } = await supabase
        .from("due_dates")
        .update({ timestamp, is_done })
        .eq("id", id)
        .order("id")
        .limit(1)
        .single();

      if (newDueDateError) {
        throw newDueDateError;
      }

      res.status(200).json({
        data: newDueDate,
        message: "Due Date successfully updated.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }

  // Delete a due date that card has.
  if (req.method === "DELETE") {
    try {
      const { error: userError } = await supabase.auth.api.getUser(token);

      if (userError) {
        throw userError;
      }

      const { id } = req.query as {
        id: string;
      };

      // Delete a due date by id.
      const { data: deletedDueDate, error: deletedDueDateError } =
        await supabase
          .from("due_dates")
          .delete()
          .eq("id", id)
          .order("id")
          .limit(1)
          .single();

      if (deletedDueDateError) {
        throw deletedDueDateError;
      }

      res.status(200).json({
        data: deletedDueDate,
        message: "Due Date successfully deleted.",
      });
    } catch (error: any) {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default handler;
