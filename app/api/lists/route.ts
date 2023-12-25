import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import supabase from "../../helpers/supabase";

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

    const { data: lists, error: listsError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", boardId)
      .order("index");

    if (listsError) {
      throw listsError;
    }

    return new Response(
      JSON.stringify({
        data: lists,
        message: "There are existing lists.",
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

export const POST = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { title, board_id } = (await request.json()) as {
      title: string;
      board_id: string;
    };

    const { data: lists, error: listsError } = await supabase
      .from("lists")
      .select("*")
      .eq("board_id", board_id);

    if (listsError) {
      throw listsError;
    }

    const { data: list, error: listError } = await supabase
      .from("lists")
      .insert([{ title, board_id, index: lists.length }])
      .limit(1)
      .single();

    if (listError) {
      throw listError;
    }

    return new Response(
      JSON.stringify({
        data: list,
        message: "List successfully created.",
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
