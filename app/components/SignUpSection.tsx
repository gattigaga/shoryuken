"use client";

import { FC } from "react";
import { Trans } from "@lingui/macro";
import Link from "next/link";

import Button from "./Button";

const SignUpSection: FC = () => {
  return (
    <div className="w-full px-4 py-12 flex flex-col bg-gradient-to-tr from-blue-900 to-pink-500 md:px-16 xl:px-32 xl:py-24">
      <h2 className="text-white text-xl font-bold text-center leading-normal mb-6 xl:text-3xl">
        <Trans>Get started with Shoryuken today</Trans>
      </h2>
      <Link className="w-full md:w-fit md:self-center" href="/auth/signup">
        <Button className="w-full" type="button">
          <Trans>Sign up - it’s free!</Trans>
        </Button>
      </Link>
    </div>
  );
};

export default SignUpSection;
