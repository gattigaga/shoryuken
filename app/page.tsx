import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import CoreSection from "./components/CoreSection";
import TestimonySection from "./components/TestimonySection";
import MainSection from "./components/MainSection";
import SignUpSection from "./components/SignUpSection";
import { getUser } from "./helpers/data";

export const metadata: Metadata = {
  title: "Shoryuken | Manage Your Projects",
  description:
    "Shoryuken brings all your tasks, teammates, and tools together. Keep everything in the same place—even if your team isn’t.",
};

const HomePage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <MainSection />
        <CoreSection />
        <TestimonySection />
        <SignUpSection />
      </main>

      <Footer />
      <Loading />
    </div>
  );
};

export default HomePage;
