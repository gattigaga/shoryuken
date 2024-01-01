import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Sign In | Shoryuken",
};

const SignInPage = () => {
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

          <Form />
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
