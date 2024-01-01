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
      <main className="pt-12 w-80 mx-auto flex flex-col md:w-96">
        <Link className="self-center mb-6" href="/">
          <Image
            src="/images/logo-with-text.svg"
            alt="Shoryuken logo"
            width={240}
            height={64}
          />
        </Link>

        <Form />
      </main>
    </div>
  );
};

export default ResetPasswordPage;
