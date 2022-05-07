import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { UIEventHandler, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { addDays } from "date-fns";
import Image from "next/image";
import Button from "../components/Button";
import Link from "next/link";

const Home: NextPage = () => {
  const router = useRouter();
  const refHeader = useRef<HTMLDivElement>(null);

  const year = new Date().getFullYear();

  const handleHeaderStyle = () => {
    if (window.scrollY >= 64) {
      refHeader.current?.classList.add("bg-white");
      refHeader.current?.classList.add("shadow-md");
    } else {
      refHeader.current?.classList.remove("bg-white");
      refHeader.current?.classList.remove("shadow-md");
    }
  };

  // Listen to recovery link to open reset password page
  // and listen to sign in link to sign in with password
  // or 3rd party providers (i.e. Google).
  useEffect(() => {
    const rawParams = router.asPath.replace("/#", "");
    const params = new URLSearchParams(rawParams);
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

  useEffect(() => {
    window.addEventListener("scroll", handleHeaderStyle);

    return () => window.removeEventListener("scroll", handleHeaderStyle);
  }, []);

  return (
    <div>
      <Head>
        <title>Shoryuken</title>
      </Head>

      {/* Header */}
      <header
        ref={refHeader}
        className="flex items-center px-4 py-2 fixed w-full"
      >
        <Image
          src="/images/logo-with-text.svg"
          alt="Shoryuken Logo"
          width={128}
          height={64}
        />
        <Link href="/auth/signin">
          <a className="text-xs font-semibold text-slate-700 ml-auto mr-4">
            Sign In
          </a>
        </Link>
        <Link href="/auth/signup">
          <a>
            <Button type="button">Sign Up</Button>
          </a>
        </Link>
      </header>

      {/* Main */}
      <main>
        <div className="flex flex-col items-center px-4 pb-16 pt-32 bg-gradient-to-b from-blue-100 to-white">
          <h1 className="font-semibold text-3xl text-center mb-4 text-slate-700">
            Shoryuken helps teams move work forward.
          </h1>
          <p className="text-center text-slate-700 mb-8">
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is
            unique—accomplish it all with Shoryuken.
          </p>
          <Link href="/auth/signup">
            <a className="w-full">
              <Button className="w-full" type="button">
                Sign Up - it&lsquo;s free
              </Button>
            </a>
          </Link>
        </div>
        <div className="flex flex-col items-center px-4 py-16">
          <p className="font-semibold text-2xl text-center mb-4 text-slate-700">
            It&lsquo;s more than work. It&lsquo;s a way of working together.
          </p>
          <p className="text-center mb-8 text-slate-700">
            Start with a Shoryuken board, lists, and cards. Customize and expand
            with more features as your teamwork grows. Manage projects, organize
            tasks, and build team spirit—all in one place.
          </p>
          <Link href="/auth/signup">
            <a>
              <Button
                className="border border-blue-500"
                backgroundColor={["bg-white", "bg-white"]}
                textColor="text-blue-500"
                type="button"
              >
                Start doing
              </Button>
            </a>
          </Link>
        </div>
        <div className="px-4 py-16">
          <div className="w-full flex flex-col items-center rounded p-4 bg-gradient-to-b from-blue-500 to-cyan-500">
            <p className="text-center text-white font-semibold mb-8">
              Sign up and get started with Shoryuken today. A world of
              productive teamwork awaits!
            </p>
            <Link href="/auth/signup">
              <a className="w-full">
                <Button
                  className="w-full"
                  backgroundColor={["bg-white", "bg-slate-50"]}
                  textColor="text-slate-700"
                  type="button"
                >
                  Sign up
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center pb-16">
        <Image
          className="grayscale"
          src="/images/logo-with-text.svg"
          alt="Shoryuken Logo"
          width={160}
          height={64}
        />
        <p className="text-slate-700">
          &copy; Copyright {year}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
