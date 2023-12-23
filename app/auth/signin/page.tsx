import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata, NextPage } from "next";

import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Sign Up | Shoryuken",
};

const SignInPage: NextPage = () => {
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
              Sign in to Shoryuken
            </h1>

            <Form />

            <div className="w-full border-t my-6" />
            <div className="flex justify-center items-center">
              <Link href="/auth/forgot-password">
                <p className="text-xs text-blue-700 text-center">
                  Can&lsquo;t sign in?
                </p>
              </Link>
              <span className="mx-3 text-slate-600">&#8226;</span>
              <Link href="/auth/signup">
                <p className="text-xs text-blue-700 text-center">
                  Sign up for an account
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
