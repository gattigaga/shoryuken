import type { Metadata, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import Button from "./components/Button";
import Header from "./components/Header";
import Loading from "./components/Loading";

export const metadata: Metadata = {
  title: "Shoryuken | Manage Your Projects",
};

const HomePage: NextPage = () => {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <div className="pb-16 pt-32 bg-gradient-to-b from-blue-100 to-white lg:pt-56">
          <div className="flex flex-col items-center px-4 lg:items-start lg:px-16">
            <div className="max-w-[560px] md:max-w-3xl lg:max-w-2xl">
              <h1 className="font-semibold text-3xl text-center mb-4 text-slate-700 md:text-5xl md:text-left">
                Shoryuken helps teams move work forward.
              </h1>
              <p className="text-center text-lg text-slate-700 mb-8 md:text-left md:mb-12">
                Collaborate, manage projects, and reach new productivity peaks.
                From high rises to the home office, the way your team works is
                unique—accomplish it all with Shoryuken.
              </p>
              <Link href="/auth/signup" className="w-full lg:w-auto">
                <Button className="w-full lg:w-auto" type="button">
                  Sign Up - it&lsquo;s free
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-4 py-16 lg:py-32">
          <div className="flex flex-col items-center max-w-[560px] md:max-w-3xl">
            <p className="font-semibold text-2xl text-center mb-4 text-slate-700 md:text-4xl">
              It&lsquo;s more than work. It&lsquo;s a way of working together.
            </p>
            <p className="text-center text-lg text-slate-700 mb-8 md:mb-12">
              Start with a Shoryuken board, lists, and cards. Customize and
              expand with more features as your teamwork grows. Manage projects,
              organize tasks, and build team spirit—all in one place.
            </p>
            <Link href="/auth/signup">
              <Button
                className="border border-blue-500"
                backgroundColor={["bg-white", "bg-white"]}
                textColor="text-blue-500"
                type="button"
              >
                Start doing
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-4 py-16 flex justify-center lg:py-32">
          <div className="w-full max-w-md flex flex-col items-center rounded px-4 py-12 bg-gradient-to-b from-blue-500 to-cyan-500 md:max-w-3xl">
            <div className="max-w-[560px]">
              <p className="text-center text-white text-lg font-semibold mb-8 md:text-2xl">
                Sign up and get started with Shoryuken today. A world of
                productive teamwork awaits!
              </p>
              <Link href="/auth/signup" className="w-full">
                <Button
                  className="w-full"
                  backgroundColor={["bg-white", "bg-slate-50"]}
                  textColor="text-slate-700"
                  type="button"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

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

      <Loading />
    </div>
  );
};

export default HomePage;
