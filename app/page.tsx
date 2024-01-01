import type { Metadata } from "next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import CoreSection from "./components/CoreSection";
import TestimonySection from "./components/TestimonySection";
import MainSection from "./components/MainSection";
import SignUpSection from "./components/SignUpSection";

export const metadata: Metadata = {
  title: "Shoryuken | Manage Your Projects",
};

const HomePage = () => {
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
