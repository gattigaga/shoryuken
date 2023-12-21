import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata, NextPage } from "next";

import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Sign Up | Shoryuken",
};

const SignUpPage: NextPage = () => {
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
              Sign up for your account
            </h1>

            <Form />

            <div className="w-full border-t my-6" />
            <Link href="/auth/signin">
              <p className="text-xs text-blue-700 text-center">
                Already have an account? Sign in
              </p>
            </Link>
          </div>
          <p className="text-xs text-slate-500 text-center leading-normalm mt-8">
            This page is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://www.google.com/policies/privacy/"
              className="text-blue-700"
            >
              Privacy Policy
            </a>
            and{" "}
            <a
              href="https://www.google.com/policies/terms/"
              className="text-blue-700"
            >
              Terms of Service
            </a>{" "}
            apply
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
