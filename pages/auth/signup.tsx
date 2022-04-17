import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Input from "../../components/Input";
import Button from "../../components/Button";

const SignUpPage = () => {
  return (
    <div>
      <Head>
        <title>Sign Up | Shoryuken</title>
      </Head>

      <main className="py-12 md:bg-slate-50">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo-with-text.svg" width={240} height={64} />
          </div>
          <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
            <h1 className="font-semibold text-center text-slate-600 mb-6">
              Sign up for your account
            </h1>
            <div className="mb-4">
              <Input
                className="w-full"
                placeholder="Enter email"
                errorMessage="The provided email address is not allowed, please use a different
            one."
                isError
              />
            </div>
            <p className="text-xs text-slate-500 leading-normal mb-8 px-2">
              By signing up, I accept the{" "}
              <Link href="/">
                <a className="text-blue-700">Shoryuken Terms of Service</a>
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/">
                <a className="text-blue-700">Privacy Policy</a>
              </Link>
              .
            </p>
            <Button className="w-full">Sign Up</Button>
            <div className="w-full border-t my-6" />
            <Link href="/">
              <a>
                <p className="text-xs text-blue-700 text-center">
                  Already have an account? Sign in
                </p>
              </a>
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
            </a>
            apply
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
