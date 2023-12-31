"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

import Button from "../../../../components/Button";

const Content: FC = () => {
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
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Check your inbox to reset password</Trans>
      </h1>
      <p className="text-xs text-slate-500 leading-normal mb-2">
        <Trans>
          To reset your password, click the recovery link in the email
          we&lsquo;ve sent to
        </Trans>
      </p>

      <p className="text-sm font-semibold text-slate-600 leading-normal mb-8">
        {email}
      </p>

      <Link href="/auth/signin">
        <Button className="w-full">
          <Trans>Back to Sign In</Trans>
        </Button>
      </Link>
    </div>
  );
};

export default Content;
