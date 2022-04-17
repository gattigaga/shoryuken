import React from "react";
import Head from "next/head";
import Image from "next/image";

import Button from "../../../components/Button";

const EmailSentPage = () => {
  return (
    <div>
      <Head>
        <title>Verify your email | Shoryuken</title>
      </Head>

      <main className="py-12 md:bg-slate-50">
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
              nintendo.life@gmail.com
            </p>
            <Button className="w-full">Resend Verification Email</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailSentPage;
