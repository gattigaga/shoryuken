import type { Metadata } from "next";

import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import CoreSection from "./components/CoreSection";
import TestimonySection from "./components/TestimonySection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shoryuken | Manage Your Projects",
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <div className="h-screen relative">
          <img
            className="w-full h-screen object-cover object-bottom"
            src="/images/wave.svg"
            alt="Wave"
          />

          <div className="h-screen absolute top-0 left-0 px-4 pt-32 w-full flex flex-col gap-y-12 md:px-16 md:pt-48 xl:px-32 xl:flex-row xl:gap-x-24">
            <div className="flex flex-col">
              <h1 className="text-white text-2xl font-bold text-center leading-normal mb-4 md:text-4xl xl:text-left xl:text-5xl xl:mb-6">
                Shoryuken brings all your tasks, teammates, and tools together
              </h1>
              <p className="text-white text-center text-lg mb-8 xl:text-left xl:text-xl">
                Keep everything in the same place—even if your team isn’t.
              </p>
              <Link
                className="w-full md:w-fit md:self-center xl:self-start"
                href="/auth/signup"
              >
                <Button className="w-full" type="button">
                  Sign up - it’s free!
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

        <CoreSection />
        <TestimonySection />

        <div className="w-full px-4 py-12 flex flex-col bg-gradient-to-tr from-blue-900 to-pink-500 md:px-16 xl:px-32 xl:py-24">
          <h2 className="text-white text-xl font-bold text-center leading-normal mb-6 xl:text-3xl">
            Get started with Shoryuken today
          </h2>
          <Link className="w-full md:w-fit md:self-center" href="/auth/signup">
            <Button className="w-full" type="button">
              Sign up - it’s free!
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
      <Loading />
    </div>
  );
};

export default HomePage;
