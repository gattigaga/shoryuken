import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import Content from "./components/Content";

export const metadata: Metadata = {
  title: "Verify your email | Shoryuken",
};

const EmailSentPage = () => {
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

        <Content />
      </main>
    </div>
  );
};

export default EmailSentPage;
