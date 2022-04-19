import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MdChevronLeft } from "react-icons/md";

import Layout from "../../components/Layout";
import supabase from "../../helpers/supabase";
import EditableText from "../../components/EditableText";
import { deleteBoardById, getBoardById, putBoardById } from "../../api/boards";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params as {
    slug: string;
  };

  const { data: boards, error: boardsError } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug);

  if (boardsError) {
    throw boardsError;
  }

  if (!boards.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      initialBoard: boards[0],
    },
  };
};

type Props = NextPage & {
  initialBoard: {
    id: string;
    title: string;
    slug: string;
  };
};

const BoardDetailPage: React.FC<Props> = ({ initialBoard }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: board } = useQuery(
    "boardDetail",
    getBoardById(initialBoard.id),
    {
      initialData: initialBoard,
    }
  );

  const boardUpdateMutation = useMutation(putBoardById(board.id), {
    onSuccess: () => {
      queryClient.invalidateQueries("boardDetail");
    },
    onError: () => {
      toast.error("Failed to update board title.");
    },
  });

  const boardDeleteMutation = useMutation(deleteBoardById(board.id), {
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete a board.");
    },
  });

  return (
    <Layout>
      <Head>
        <title>{board.title} | Shoryuken</title>
      </Head>

      <div className="bg-blue-600 h-screen px-4 py-2">
        <div className="flex items-center">
          <Link href="/dashboard">
            <a className="mr-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <MdChevronLeft color="white" size={24} />
              </div>
            </a>
          </Link>
          <EditableText
            value={board.title}
            onSubmit={(value) => {
              boardUpdateMutation.mutate({
                title: value,
              });
            }}
          />
          <button
            className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
            onClick={() => boardDeleteMutation.mutate()}
          >
            Delete
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BoardDetailPage;
