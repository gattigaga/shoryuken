import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import supabase from "../../helpers/supabase";
import { getHttpStatusCode } from "../../helpers/others";

export const GET = async (request: NextRequest) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const searchParams = request.nextUrl.searchParams;
    const boardId = searchParams.get("board_id");

    const { data: boardMembers, error: boardMembersError } = await supabase
      .from("board_members")
      .select("*, user:users(*)")
      .eq("board_id", boardId)
      .order("created_at");

    if (boardMembersError) {
      throw boardMembersError;
    }

    return new Response(
      JSON.stringify({
        data: boardMembers,
        message: "There are existing board members.",
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

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { board_id, user_id } = (await request.json()) as {
      board_id: string;
      user_id: string;
    };

    const { data: boardMember, error: boardMemberError } = await supabase
      .from("board_members")
      .select("*")
      .eq("board_id", board_id)
      .eq("user_id", user_id)
      .limit(1)
      .maybeSingle();

    if (boardMemberError) {
      throw boardMemberError;
    }

    if (boardMember) {
      return new Response(
        JSON.stringify({
          message: "Board member is already exist.",
        }),
        {
          status: 409,
        }
      );
    }

    const { data: newBoardMember, error: newBoardMemberError } = await supabase
      .from("board_members")
      .insert([
        {
          board_id,
          user_id,
        },
      ])
      .limit(1)
      .single();

    if (newBoardMemberError) {
      throw newBoardMemberError;
    }

    return new Response(
      JSON.stringify({
        data: newBoardMember,
        message: "Board member successfully created.",
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
