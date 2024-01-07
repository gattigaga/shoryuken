import { cookies } from "next/headers";

import supabase from "../../../helpers/supabase";
import { getHttpStatusCode } from "../../../helpers/others";

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

    // Delete a board member by id.
    const { data: deletedBoardMember, error: deletedBoardMemberError } =
      await supabase
        .from("board_members")
        .delete()
        .eq("id", id)
        .order("id")
        .limit(1)
        .maybeSingle();

    if (deletedBoardMemberError) {
      throw deletedBoardMemberError;
    }

    if (!deletedBoardMember) {
      return new Response(
        JSON.stringify({
          message: "Board member doesn't exist.",
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: deletedBoardMember,
        message: "Board member successfully deleted.",
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
