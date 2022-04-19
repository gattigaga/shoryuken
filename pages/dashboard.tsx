import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useQuery } from "react-query";

import Board from "../components/Board";
import CreateBoardButton from "../components/CreateBoardButton";
import ModalCreateBoard from "../components/ModalCreateBoard";
import { getBoards } from "../api/boards";
import Layout from "../components/Layout";
import { getMe } from "../api/user";

const DashboardPage: NextPage = () => {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const { data: myself } = useQuery("me", getMe);

  const { data: boards } = useQuery("boards", getBoards, {
    initialData: [],
  });

  const username = myself?.user_metadata?.username || "";

  return (
    <Layout>
      <Head>
        <title>Dashboard | Shoryuken</title>
      </Head>

      <div className="px-8 pt-12 pb-32">
        <div className="w-full mx-auto sm:w-5/6">
          <h1 className="text-2xl font-semibold text-slate-600 mb-8">
            My Boards
          </h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boards.map((board: any) => {
              return (
                <Board
                  key={board.id}
                  title={board.title}
                  href={`/boards/${board.slug}`}
                />
              );
            })}
            <CreateBoardButton onClick={() => setIsCreateBoardOpen(true)} />
          </div>
        </div>
      </div>
      <ModalCreateBoard
        onRequestClose={() => setIsCreateBoardOpen(false)}
        isOpen={isCreateBoardOpen}
      />
    </Layout>
  );
};

export default DashboardPage;
