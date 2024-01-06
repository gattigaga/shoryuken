import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import {
  getBoardBySlug,
  getListsByBoardId,
  getUser,
} from "../../../helpers/data";
import NavBar from "../../components/NavBar";
import NetworkStatus from "../../components/NetworkStatus";

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
  const lists = await getListsByBoardId(board?.id);

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <NavBar color={board?.color} />

      <main className="flex-1 overflow-auto flex flex-col">
        <Content board={board || undefined} lists={lists || undefined} />
        <NetworkStatus />
      </main>
    </div>
  );
};

export default BoardDetailPage;
