import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import { getUser } from "../../../helpers/auth";
import supabase from "../../../helpers/supabase";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const boardId = params.slug.split("-")[0];

  const user = await getUser();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .eq("user_id", user?.id)
    .limit(1)
    .single();

  if (boardError) {
    throw boardError;
  }

  return {
    title: `${board.title} | Shoryuken`,
  };
}

const BoardDetailPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <Content />;
};

export default BoardDetailPage;
