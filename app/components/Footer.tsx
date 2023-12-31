"use client";

import { FC } from "react";
import Link from "next/link";
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";

const Footer: FC = () => {
  const year = new Date().getFullYear();
  const { i18n } = useLingui();

  return (
    <footer className="bg-blue-950 px-8 pt-8 pb-16 md:px-16 xl:px-32 xl:pb-0">
      <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-16">
        <div className="border-b border-blue-700 pb-8 xl:pb-0 xl:border-b-0">
          <img
            className="w-36 xl:w-48"
            src="/images/logo-with-text-white.svg"
            alt="Shoryuken Logo"
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

      <div className="flex flex-col gap-y-12 mt-8 xl:flex-row xl:border-t xl:border-blue-700">
        <div className="flex flex-col flex-1 gap-y-2 xl:flex-row xl:gap-x-6 xl:py-4">
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

        <div className="flex flex-row gap-x-6">
          <button
            className="text-white text-xs"
            type="button"
            onClick={() => i18n.activate("en")}
          >
            EN
          </button>
          <button
            className="text-white text-xs"
            type="button"
            onClick={() => i18n.activate("id")}
          >
            ID
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
