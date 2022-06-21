import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Loading from "react-spinners/ScaleLoader";

import Board from "../components/Board";
import CreateBoardButton from "../components/CreateBoardButton";
import ModalCreateBoard from "../components/ModalCreateBoard";
import Layout from "../components/Layout";
import { withAuthGuard } from "../helpers/server";
import useBoardsQuery from "../hooks/boards/use-boards-query";

export const getServerSideProps: GetServerSideProps = withAuthGuard(
  async () => {
    return {
      props: {},
    };
  }
);

const DashboardPage: NextPage = () => {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const boardsQuery = useBoardsQuery();

  return (
    <Layout>
      <Head>
        <title>Dashboard | Shoryuken</title>
      </Head>

      <div className="min-h-full">
        {boardsQuery.status === "success" && (
          <div className="px-8 pt-12 pb-32 w-full mx-auto sm:w-5/6">
            <h1 className="text-2xl font-semibold text-slate-600 mb-8">
              My Boards
            </h1>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {boardsQuery.data.map((board: any) => {
                return (
                  <Board
                    key={board.id}
                    title={board.title}
                    href={`/boards/${board.id}-${board.slug}`}
                    isDisabled={board.id > 10000}
                  />
                );
              })}
              <CreateBoardButton onClick={() => setIsCreateBoardOpen(true)} />
            </div>
          </div>
        )}
        {boardsQuery.status === "loading" && (
          <div className="h-full flex justify-center items-center">
            <Loading
              height={72}
              width={8}
              radius={16}
              margin={4}
              color="rgb(29 78 216)"
            />
          </div>
        )}
      </div>
      <ModalCreateBoard
        onRequestClose={() => setIsCreateBoardOpen(false)}
        isOpen={isCreateBoardOpen}
      />
    </Layout>
  );
};

export default DashboardPage;
