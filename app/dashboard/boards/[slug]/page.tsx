import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import { getBoardBySlug, getUser } from "../../../helpers/data";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const user = await getUser();
  const board = await getBoardBySlug(params.slug, user?.id);

  if (!board) {
    return {
      title: `Board not found | Shoryuken`,
      description: "This board is not exists or you don't have access to it.",
    };
  }

  return {
    title: `${board.title} | Shoryuken`,
    description:
      "Be creative and thinking out of the box when managing your project.",
  };
}

const BoardDetailPage = async ({ params }: Props) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const board = await getBoardBySlug(params.slug, user.id);

  return <Content board={board || undefined} />;
};

export default BoardDetailPage;
