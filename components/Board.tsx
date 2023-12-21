import Link from "next/link";
import React from "react";

import { getExcerpt } from "../helpers/formatter";

type Props = {
  title: string;
  href: string;
  isDisabled?: boolean;
};

const Board: React.FC<Props> = ({ title, href, isDisabled }) => {
  const content = (
    <div className="p-4 h-32 bg-blue-700 rounded hover:bg-blue-800">
      <p className="text-md font-semibold text-white">
        {getExcerpt(title, 50)}
      </p>
    </div>
  );

  if (isDisabled) return content;

  return <Link href={href}>{content}</Link>;
};

export default Board;
