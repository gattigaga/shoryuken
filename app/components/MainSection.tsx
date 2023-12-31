"use client";

import { FC } from "react";
import { Trans } from "@lingui/macro";
import Link from "next/link";

import Button from "./Button";

const MainSection: FC = () => {
  return (
    <div className="h-screen relative">
      <img
        className="w-full h-screen object-cover object-bottom"
        src="/images/wave.svg"
        alt="Wave"
      />

      <div className="h-screen absolute top-0 left-0 px-4 pt-32 w-full flex flex-col gap-y-12 md:px-16 md:pt-48 xl:px-32 xl:flex-row xl:gap-x-24">
        <div className="flex flex-col">
          <h1 className="text-white text-2xl font-bold text-center leading-normal mb-4 md:text-4xl xl:text-left xl:text-5xl xl:mb-6">
            <Trans>
              Shoryuken brings all your tasks, teammates, and tools together
            </Trans>
          </h1>
          <p className="text-white text-center text-lg mb-8 xl:text-left xl:text-xl">
            <Trans>
              Keep everything in the same place—even if your team isn’t.
            </Trans>
          </p>
          <Link
            className="w-full md:w-fit md:self-center xl:self-start"
            href="/auth/signup"
          >
            <Button className="w-full" type="button">
              <Trans>Sign up - it’s free!</Trans>
            </Button>
          </Link>
        </div>

        <div className="xl:-mt-16 xl:w-screen">
          <img
            className="w-full aspect-square object-cover object-left-bottom"
            src="/images/home-page/main.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
