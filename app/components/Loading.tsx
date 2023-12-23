"use client";

import { FC } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "react-spinners/ScaleLoader";

const Loading: FC = () => {
  const searchParams = useSearchParams();

  if (!searchParams?.get("access_token")) {
    return null;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center fixed top-0 left-0 z-10 bg-white">
      <Spinner
        height={72}
        width={8}
        radius={16}
        margin={4}
        color="rgb(29 78 216)"
      />
    </div>
  );
};

export default Loading;
