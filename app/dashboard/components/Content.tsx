"use client";

import { FC, useState } from "react";
import Spinner from "react-spinners/ScaleLoader";

import useBoardsQuery from "../hooks/use-boards-query";
import ModalCreateBoard from "./ModalCreateBoard";
import CreateBoardButton from "./CreateBoardButton";
import Board from "./Board";

const Content: FC = () => {
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const boardsQuery = useBoardsQuery();

  return (
    <>
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
                    href={`dashboard/boards/${board.id}-${board.slug}`}
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
            <Spinner
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
    </>
  );
};

export default Content;
