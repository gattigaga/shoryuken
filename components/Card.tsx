import Link from "next/link";
import React from "react";
import { MdEdit, MdSubject } from "react-icons/md";

type Props = {
  title: string;
  href: string;
  hasDescription?: boolean;
};

const Card: React.FC<Props> = ({ title, href, hasDescription }) => {
  return (
    <Link href={href}>
      <a>
        <div className="group p-2 bg-white rounded shadow mb-2 flex hover:bg-slate-200">
          <div className="flex-1">
            <p className="text-xs">{title}</p>
            {hasDescription && (
              <div className="flex items-center mt-2">
                {hasDescription && (
                  <span className="text-slate-500">
                    <MdSubject size={20} />
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-white group-hover:text-slate-500">
            <MdEdit size={16} />
          </span>
        </div>
      </a>
    </Link>
  );
};

export default Card;
