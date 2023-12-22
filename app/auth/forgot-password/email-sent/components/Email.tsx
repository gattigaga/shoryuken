"use client";

import { redirect, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const Email: FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newEmail = sessionStorage.getItem("forgotPasswordEmail") || "";

      if (!newEmail) {
        router.replace("/auth/forgot-password");
        return;
      }

      setEmail(newEmail);
      return;
    }
  }, []);

  if (!email) {
    redirect("/auth/forgot-password");
  }

  return (
    <p className="text-sm font-semibold text-slate-600 leading-normal mb-8">
      {email}
    </p>
  );
};

export default Email;
