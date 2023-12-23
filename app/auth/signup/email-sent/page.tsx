import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata, NextPage } from "next";

import Button from "../../../components/Button";
import Email from "./components/Email";

export const metadata: Metadata = {
  title: "Verify your email | Shoryuken",
};

const EmailSentPage: NextPage = () => {
  return (
    <div className="min-h-screen md:bg-slate-50">
      <main className="py-12">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/images/logo-with-text.svg"
                alt="Shoryuken logo"
                width={240}
                height={64}
              />
            </Link>
          </div>
          <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
            <h1 className="font-semibold text-center text-slate-600 mb-6">
              Check your inbox to log in
            </h1>
            <p className="text-xs text-slate-500 leading-normal mb-2">
              To complete setup and log in, click the verification link in the
              email we&lsquo;ve sent to
            </p>

            <Email />

            <Link href="/auth/signin">
              <Button className="w-full">Back to Sign In</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailSentPage;
