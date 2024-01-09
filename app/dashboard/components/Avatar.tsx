import { FC } from "react";
import classNames from "classnames";

type Props = {
  fullname: string;
  size?: "small" | "medium";
  isShowAll?: boolean;
  onClick?: () => void;
};

const Avatar: FC<Props> = ({
  fullname,
  size = "medium",
  isShowAll,
  onClick,
}) => {
  const label = isShowAll
    ? fullname
    : fullname
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

  return (
    <button type="button" onClick={onClick}>
      <div
        className={classNames(
          "rounded-full aspect-square bg-white flex items-center justify-center",
          {
            "w-8": size === "medium",
            "w-6": size === "small",
          }
        )}
      >
        <p
          style={{ fontSize: size === "small" ? "0.75rem" : "1rem" }}
          className="font-semibold text-slate-500 leading-none mt-0.5"
        >
          {label}
        </p>
      </div>
    </button>
  );
};

export default Avatar;
