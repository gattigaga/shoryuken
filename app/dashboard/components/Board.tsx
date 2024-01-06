import Link from "next/link";
import { FC } from "react";

import { getExcerpt } from "../helpers/formatter";
import { getTailwindColors } from "../helpers/others";

type Props = {
  title: string;
  color: string;
  href: string;
  isDisabled?: boolean;
};

const Board: FC<Props> = ({ title, color, href, isDisabled }) => {
  const content = (
    <div className="root p-4 h-32 rounded">
      <p className="text-md font-semibold text-white">
        {getExcerpt(title, 50)}
      </p>

      <style jsx>{`
        .root {
          background: ${getTailwindColors(color, 700)};

          &:hover {
            background: ${getTailwindColors(color, 800)};
          }
        }
      `}</style>
    </div>
  );

  if (isDisabled) return content;

  return <Link href={href}>{content}</Link>;
};

export default Board;
