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

      <main className="px-6 pt-6">
        <div className="flex justify-center">
          <Image src="/images/logo-with-text.svg" width={240} height={64} />
        </div>
        <h1 className="font-semibold text-center text-slate-600 mt-6 mb-6">
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
        <p className="text-xs text-slate-500 text-center leading-normalm mt-8">
          This page is protected by reCAPTCHA and the Google{" "}
          <Link href="/">
            <a className="text-blue-700">Privacy Policy</a>
          </Link>{" "}
          and{" "}
          <Link href="/">
            <a className="text-blue-700">Terms of Service</a>
          </Link>{" "}
          apply
        </p>
      </main>
    </div>
  );
};

export default SignUpPage;
