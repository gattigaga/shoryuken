"use client";

import { FC, useEffect, useState } from "react";
import Spinner from "react-spinners/ScaleLoader";

const Loading: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryString = window.location.hash.replace("#", "");
      const params = new URLSearchParams(queryString);

      setIsLoading(!!params.get("access_token"));
    }
  }, []);

  if (!isLoading) return null;

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
