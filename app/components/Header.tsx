"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { addDays } from "date-fns";
import classNames from "classnames";

import Button from "./Button";

const Header: FC = () => {
  const [isFloating, setIsFloating] = useState(false);
  const router = useRouter();
  const refHeader = useRef<HTMLDivElement>(null);
  const refSignInLink = useRef<HTMLAnchorElement>(null);

  // Listen to recovery link to open reset password page
  // and listen to sign in link to sign in with password
  // or 3rd party providers (i.e. Google).
  useEffect(() => {
    const queryString = window.location.hash.replace("#", "");
    const params = new URLSearchParams(queryString);
    const accessToken = params.get("access_token");
    const providerToken = params.get("provider_token");
    const type = params.get("type");

    if (accessToken) {
      Cookies.set("access_token", accessToken, {
        expires: addDays(new Date(), 7),
        path: "/",
      });

      if (type === "signup") {
        router.replace("/dashboard");
      }

      if (type === "recovery") {
        router.replace("/auth/reset-password");
      }

      if (providerToken) {
        router.replace("/auth/account-details");
      }
    }
  }, []);

  // Handle style of the header when scroll down.
  useEffect(() => {
    const handleHeaderStyle = () => {
      setIsFloating(window.scrollY >= 64);
    };

    window.addEventListener("scroll", handleHeaderStyle);

    return () => window.removeEventListener("scroll", handleHeaderStyle);
  }, []);

  return (
    <header
      ref={refHeader}
      className={classNames(
        "flex items-center px-4 py-2 fixed w-full z-10 md:px-16 xl:px-32",
        {
          "bg-white": isFloating,
          "shadow-md": isFloating,
        }
      )}
    >
      <Image
        src={
          isFloating
            ? "/images/logo-with-text.svg"
            : "/images/logo-with-text-white.svg"
        }
        alt="Shoryuken Logo"
        width={128}
        height={64}
      />
      <Link
        ref={refSignInLink}
        href="/auth/signin"
        className={classNames("text-xs font-semibold ml-auto mr-4", {
          "text-slate-700": isFloating,
          "text-white": !isFloating,
        })}
      >
        Sign In
      </Link>
      <Link href="/auth/signup">
        <Button type="button">Sign Up</Button>
      </Link>
    </header>
  );
};

export default Header;
