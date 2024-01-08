import { cookies } from "next/headers";

import supabase from "./supabase";
import { Board, BoardMember, List } from "../types/models";

export const getUser = async () => {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("access_token");

  const { user } = await supabase.auth.api.getUser(accessToken?.value || "");

  if (!user) {
    return null;
  }

  const newUser = {
    id: user.id,
    fullname: user.user_metadata.fullname || user.user_metadata.full_name || "",
    username: user.user_metadata.username || "",
    email: user.email || "",
    isConfirmed: !!user.email_confirmed_at,
  };

  return newUser;
};

export const getBoardBySlug = async (
  slug: string,
  userId?: string
): Promise<Board | null> => {
  const { data: myBoard } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const { data: otherBoard } = await supabase
    .from("boards")
    .select("*, board_members!inner(user_id)")
    .eq("slug", slug)
    .eq("board_members.user_id", userId)
    .limit(1)
    .maybeSingle();

  return myBoard || otherBoard;
};

export const getListsByBoardId = async (
  boardId?: number
): Promise<List[] | null> => {
  const { data: lists } = await supabase
    .from("lists")
    .select("*")
    .eq("board_id", boardId)
    .order("index");

  return lists;
};

export const getBoardMembersByBoardId = async (
  boardId?: number
): Promise<BoardMember[] | null> => {
  const { data: boardMembers } = await supabase
    .from("board_members")
    .select("*, user:users(*)")
    .eq("board_id", boardId)
    .order("index");

  return boardMembers;
};
