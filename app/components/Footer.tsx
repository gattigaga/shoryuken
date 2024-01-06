"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trans } from "@lingui/macro";
import classNames from "classnames";

import { useStore } from "../store/store";

const Footer: FC = () => {
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 px-8 pt-8 pb-16 md:px-16 xl:px-32 xl:pb-0">
      <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-16">
        <div className="border-b border-blue-700 pb-8 xl:pb-0 xl:border-b-0">
          <Image
            className="w-36 xl:w-48"
            src="/images/logo-with-text-white.svg"
            alt="Shoryuken Logo"
            width={1120}
            height={240}
          />
        </div>
        <div className="border-b border-blue-700 py-4 xl:py-0 xl:border-b-0">
          <p className="text-white text-base font-bold mb-2">
            <Trans>About Shoryuken</Trans>
          </p>
          <p className="text-white text-xs">
            <Trans>What&lsquo;s behind the boards.</Trans>
          </p>
        </div>
        <div className="border-b border-blue-700 py-4 xl:py-0 xl:border-b-0">
          <p className="text-white text-base font-bold mb-2">
            <Trans>Contact Us</Trans>
          </p>
          <p className="text-white text-xs">
            <Trans>Need anything? Get in touch and we can help.</Trans>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-12 mt-8 xl:flex-row xl:border-t xl:border-blue-700 xl:justify-between xl:py-4">
        <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-6">
          <Link href="#">
            <p className="text-xs text-white">
              <Trans>Privacy Policy</Trans>
            </p>
          </Link>
          <Link href="#">
            <p className="text-xs text-white">
              <Trans>Terms</Trans>
            </p>
          </Link>
          <p className="text-xs text-white">
            <Trans>Copyright &copy; {year} Shoryuken</Trans>
          </p>
        </div>

        <div className="flex flex-row gap-x-6 items-center">
          <button
            className={classNames("text-white text-xs", {
              "opacity-50": language === "en",
            })}
            type="button"
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={classNames("text-white text-xs", {
              "opacity-50": language === "id",
            })}
            type="button"
            onClick={() => setLanguage("id")}
          >
            ID
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
