import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { id } = params;

    const { timestamp, is_done } = (await request.json()) as {
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

    return new Response(
      JSON.stringify({
        data: newDueDate,
        message: "Due Date successfully updated.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: error.status,
      }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { id } = params;

    // Delete a due date by id.
    const { data: deletedDueDate, error: deletedDueDateError } = await supabase
      .from("due_dates")
      .delete()
      .eq("id", id)
      .order("id")
      .limit(1)
      .single();

    if (deletedDueDateError) {
      throw deletedDueDateError;
    }

    return new Response(
      JSON.stringify({
        data: deletedDueDate,
        message: "Due Date successfully deleted.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: error.status,
      }
    );
  }
};
