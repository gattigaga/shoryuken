"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

import Button from "../../../../components/Button";

const Content: FC = () => {
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
    <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
      <h1 className="font-semibold text-center text-slate-600 mb-6">
        <Trans>Check your inbox to log in</Trans>
      </h1>
      <p className="text-xs text-slate-500 leading-normal mb-2">
        <Trans>
          To complete setup and log in, click the verification link in the email
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
