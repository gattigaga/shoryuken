import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import Content from "./components/Content";
import { getUser } from "../../../helpers/data";

export const metadata: Metadata = {
  title: "Verify your email | Shoryuken",
};

const EmailSentPage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

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
