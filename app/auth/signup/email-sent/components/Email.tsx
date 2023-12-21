"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const Email: FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const newEmail = sessionStorage.getItem("signupEmail") || "";

    if (!newEmail) {
      router.replace("/auth/signup");
      return;
    }

    setEmail(newEmail);
  }, []);

  return (
    <p className="text-sm font-semibold text-slate-600 leading-normal mb-8">
      {email}
    </p>
  );
};

export default Email;
