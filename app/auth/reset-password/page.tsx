import React from "react";
import { Metadata, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Reset Password | Shoryuken",
};

const ResetPasswordPage: NextPage = () => {
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
              Reset your password
            </h1>

            <Form />

            <div className="w-full border-t my-6" />
            <Link href="/auth/signin">
              <p className="text-xs text-blue-700 text-center">
                Return to sign in
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
