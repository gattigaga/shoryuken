import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "../../../components/Button";

const EmailSentPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newEmail = sessionStorage.getItem("signupEmail") || "";

      if (!newEmail) {
        router.replace("/auth/signup");
        return;
      }

      setEmail(newEmail);
      return;
    }
  }, []);

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen md:bg-slate-50">
      <Head>
        <title>Verify your email | Shoryuken</title>
      </Head>

      <main className="py-12">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo-with-text.svg" width={240} height={64} />
          </div>
          <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
            <h1 className="font-semibold text-center text-slate-600 mb-6">
              Check your inbox to log in
            </h1>
            <p className="text-xs text-slate-500 leading-normal mb-2">
              To complete setup and log in, click the verification link in the
              email we&lsquo;ve sent to
            </p>
            <p className="text-sm font-semibold text-slate-600 leading-normal mb-8">
              {email}
            </p>
            <Link href="/">
              <a>
                <Button className="w-full">Back to Sign In</Button>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailSentPage;
