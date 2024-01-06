import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";
import { moveElement } from "../../../helpers/data-structures";
import { getHttpStatusCode } from "../../../helpers/others";

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

    const { content, index, is_checked } = (await request.json()) as {
      content: string;
      index: number;
      is_checked: boolean;
    };

    // Get a check that want to update.
    const { data: check, error: checkError } = await supabase
      .from("checks")
      .select("*")
      .eq("id", id)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (!check) {
      return new Response(
        JSON.stringify({
          message: "Check doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    // Move check in a card.
    if (index !== undefined) {
      const { data: orderedChecks, error: orderedChecksError } = await supabase
        .from("checks")
        .select("*")
        .eq("card_id", check.card_id)
        .order("index");

      if (orderedChecksError) {
        throw orderedChecksError;
      }

      const newIndices = (() => {
        const prevIndex = check.index;
        const newIndex = index;
        const indices = orderedChecks.map((check) => check.index);
        const result = moveElement(indices, prevIndex, newIndex);

        return result;
      })();

      for (const [index, orderedCheck] of orderedChecks.entries()) {
        const newIndex = newIndices.findIndex((newIndex) => newIndex === index);

        const { error } = await supabase
          .from("checks")
          .update({ index: newIndex })
          .eq("id", orderedCheck.id);

        if (error) {
          throw error;
        }
      }
    }

    const { error: newChecksError } = await supabase
      .from("checks")
      .update({ content, is_checked })
      .eq("id", id);

    if (newChecksError) {
      throw newChecksError;
    }

    const { data: newCheck, error: newCheckError } = await supabase
      .from("checks")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (newCheckError) {
      throw newCheckError;
    }

    return new Response(
      JSON.stringify({
        data: newCheck,
        message: "Check successfully updated.",
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
        status: error.status || getHttpStatusCode(error.code) || 500,
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

    // Delete a check by id.
    const { data: deletedCheck, error: deletedCheckError } = await supabase
      .from("checks")
      .delete()
      .eq("id", id)
      .order("id")
      .limit(1)
      .maybeSingle();

    if (deletedCheckError) {
      throw deletedCheckError;
    }

    if (!deletedCheck) {
      return new Response(
        JSON.stringify({
          message: "Check doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    // Get checks by card ID in order by index.
    const { data: orderedChecks, error: orderedChecksError } = await supabase
      .from("checks")
      .select("*")
      .eq("card_id", deletedCheck.card_id)
      .order("index");

    if (orderedChecksError) {
      throw orderedChecksError;
    }

    // Update the index of each check.
    for (const [index, orderedCheck] of orderedChecks.entries()) {
      const { error } = await supabase
        .from("checks")
        .update({ index })
        .eq("id", orderedCheck.id);

      if (error) {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        data: deletedCheck,
        message: "Check successfully deleted.",
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
        status: error.status || getHttpStatusCode(error.code) || 500,
      }
    );
  }
};
